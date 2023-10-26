package com.example.automotiveapp.service;

import com.example.automotiveapp.domain.Friendship;
import com.example.automotiveapp.domain.User;
import com.example.automotiveapp.dto.UserDto;
import com.example.automotiveapp.exception.BadRequestException;
import com.example.automotiveapp.exception.ResourceNotFoundException;
import com.example.automotiveapp.mapper.UserDtoMapper;
import com.example.automotiveapp.repository.FriendshipRepository;
import com.example.automotiveapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public List<UserDto> getUserFriends(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono użytkownika");
        }
        List<Friendship> friendships = friendshipRepository.findByUser1OrUser2(user.get(), user.get());

        List<User> friends = new ArrayList<>();
        for (Friendship friendship : friendships) {
            User friend = friendship.getUser1().getId() == userId ? friendship.getUser2() : friendship.getUser1();
            friends.add(friend);
        }
        return friends.stream()
                .map(UserDtoMapper::map)
                .toList();
    }

    public void addFriend(Long user2Id) {
        Optional<User> user1 = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        Optional<User> user2 = userRepository.findById(user2Id);
        if (user1.isEmpty() || user2.isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono użytkownika");
        }
        Friendship friendship = new Friendship();
        friendship.setUser1(user1.get());
        friendship.setUser2(user2.get());
        friendshipRepository.save(friendship);
    }

    public void removeFriend(Long user2Id) {
        Optional<User> user1 = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        Optional<User> user2 = userRepository.findById(user2Id);
        if (user1.isEmpty() || user2.isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono użytkownika");
        }
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1.get(), user2.get());
        if (friendship.isPresent()) {
            friendshipRepository.delete(friendship.get());
        } else {
            throw new BadRequestException("Nie znaleziono znajmości");
        }
    }

    public List<UserDto> findNotFriends() {
        Optional<User> loggedUser = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (loggedUser.isEmpty()) {
            throw new ResourceNotFoundException("Nie znaleziono użytkownika");
        }
        List<Friendship> friendships = friendshipRepository.findByUser1OrUser2(userRepository.getOne(loggedUser.get().getId()), userRepository.getOne(loggedUser.get().getId()));
        List<Long> friendIds = friendships.stream()
                .flatMap(friendship -> Stream.of(friendship.getUser1().getId(), friendship.getUser2().getId()))
                .toList();

        return userRepository.findAll().stream()
                .filter(user -> !friendIds.contains(user.getId()) && !user.getId().equals(loggedUser.get().getId()))
                .map(UserDtoMapper::map)
                .toList();
    }
}
