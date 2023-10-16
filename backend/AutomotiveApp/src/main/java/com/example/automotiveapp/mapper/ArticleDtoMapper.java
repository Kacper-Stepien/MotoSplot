package com.example.automotiveapp.mapper;

import com.example.automotiveapp.domain.Article;
import com.example.automotiveapp.domain.User;
import com.example.automotiveapp.dto.ArticleDto;
import com.example.automotiveapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleDtoMapper {
    private final UserRepository userRepository;

    public static ArticleDto map(Article article) {
        ArticleDto articleDto = new ArticleDto();
        BeanUtils.copyProperties(article, articleDto);
        articleDto.setUser(article.getUser().getNickname());
        return articleDto;
    }

    public Article map(ArticleDto articleDto) {
        Article article = new Article();
        BeanUtils.copyProperties(articleDto, article);
        Optional<User> user = userRepository.findByNicknameIgnoreCase(articleDto.getUser());
        user.ifPresent(article::setUser);
        return article;
    }
}
