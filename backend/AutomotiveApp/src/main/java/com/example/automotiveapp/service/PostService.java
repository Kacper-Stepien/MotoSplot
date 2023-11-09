package com.example.automotiveapp.service;

import com.example.automotiveapp.domain.File;
import com.example.automotiveapp.domain.Post;
import com.example.automotiveapp.domain.User;
import com.example.automotiveapp.domain.request.PostSaveRequest;
import com.example.automotiveapp.dto.PostDto;
import com.example.automotiveapp.exception.BadRequestException;
import com.example.automotiveapp.exception.ResourceNotFoundException;
import com.example.automotiveapp.mapper.PostDtoMapper;
import com.example.automotiveapp.repository.FileRepository;
import com.example.automotiveapp.repository.LikeRepository;
import com.example.automotiveapp.repository.PostRepository;
import com.example.automotiveapp.repository.UserRepository;
import com.example.automotiveapp.service.utils.SecurityUtils;
import com.example.automotiveapp.storage.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final PostDtoMapper postDtoMapper;
    private final FileStorageService fileStorageService;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    @Transactional
    public PostDto savePost(PostSaveRequest postToSave) {
        Post post = new Post();
        post.setContent(postToSave.getContent());
        post.setUser(userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono użytkownika")));
        post.setPostedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        post.setLiked(false);
        post.setLikesNumber(0);
        post.setCommentsNumber(0);
        Set<File> files = new HashSet<>();
        if (postToSave.getFiles() != null) {
            List<String> savedImageNames = fileStorageService.saveImage(postToSave.getFiles());
            for (String imageName : savedImageNames) {
                log.info(imageName);
                File file = new File();
                file.setFileUrl(imageName);
                file.setPost(post);
                files.add(file);
            }
            post.setFiles(files);
        }
        Post savedPost = postRepository.save(post);
        fileRepository.saveAll(files);
        return PostDtoMapper.map(savedPost);
    }

    public void deletePost(Long id) {
        if (postRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono posta");
        }
        PostDto postDto = PostDtoMapper.map(postRepository.findById(id).get());
        for (String imageUrl : postDto.getImageUrls()) {
            StringBuilder modifiedImageUrl = new StringBuilder(imageUrl);
            modifiedImageUrl.delete(0, "http://localhost:8080/images/".length());
            fileStorageService.deleteFile(modifiedImageUrl.toString());
        }

        postRepository.deleteById(id);
    }


    public Optional<PostDto> findPostById(long id) {
        if (postRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono posta");
        }
        return postRepository.findById(id).map(PostDtoMapper::map);
    }

    public void updatePost(PostDto postToUpdate) {
        Post post = postDtoMapper.map(postToUpdate);
        postRepository.save(post);
    }

    public Page<PostDto> getFriendsPosts(Pageable pageable) {
        List<User> friends = userRepository.findUserFriends(SecurityUtils.getCurrentUserEmail());
        List<PostDto> friendsPosts = new ArrayList<>();

        for (User friend : friends) {
            List<Post> friendPosts = postRepository.findByUser(friend);
            setPostLikes(friendPosts, friendsPosts);
        }
        List<User> publicProfiles = userRepository.findPublicProfiles();
        for (User publicProfile : publicProfiles) {
            if (!friends.contains(publicProfile)) {
                List<Post> publicProfilePosts = postRepository.findByUser(publicProfile);
                setPostLikes(publicProfilePosts, friendsPosts);
            }
        }
        return getPostDtos(pageable, friendsPosts);
    }

    public Page<PostDto> getUserPosts(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono użytkownika"));

        if (user.isPublicProfile()) {
            List<PostDto> friendsPosts = new ArrayList<>();
            List<Post> posts = postRepository.findAllByUserId(userId);
            setPostLikes(posts, friendsPosts);
            return getPostDtos(pageable, friendsPosts);
        } else {
            throw new BadRequestException("Użytkownik ma prywatny profil");
        }

    }

    private static Page<PostDto> getPostDtos(Pageable pageable, List<PostDto> friendsPosts) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), friendsPosts.size());
        return new PageImpl<>(friendsPosts.subList(start, end), pageable, friendsPosts.size());
    }

    private void setPostLikes(List<Post> posts, List<PostDto> friendsPosts) {
        for (Post post : posts) {
            PostDto postDto = PostDtoMapper.map(post);
            postDto.setLiked(likeRepository.getLikeByUser_EmailAndPostId(SecurityUtils.getCurrentUserEmail(), post.getId()).isPresent());
            friendsPosts.add(postDto);
        }
    }
}
