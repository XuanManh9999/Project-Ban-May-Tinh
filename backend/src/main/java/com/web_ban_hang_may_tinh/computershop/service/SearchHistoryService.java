package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.entity.SearchHistory;
import com.web_ban_hang_may_tinh.computershop.entity.User;
import com.web_ban_hang_may_tinh.computershop.repository.SearchHistoryRepository;
import com.web_ban_hang_may_tinh.computershop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveSearchHistory(Long userId, String keyword, int resultCount) {
        User user = userRepository.findById(userId).orElse(null);
        
        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setUser(user);
        searchHistory.setKeyword(keyword);
        searchHistory.setResultCount(resultCount);
        
        searchHistoryRepository.save(searchHistory);
    }
}

