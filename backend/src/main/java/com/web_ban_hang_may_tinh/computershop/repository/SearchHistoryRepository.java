package com.web_ban_hang_may_tinh.computershop.repository;

import com.web_ban_hang_may_tinh.computershop.entity.SearchHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    Page<SearchHistory> findByUserId(Long userId, Pageable pageable);
}

