package com.web_ban_hang_may_tinh.computershop.dto.product;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {
    
    @Size(max = 100, message = "Từ khóa tìm kiếm không được quá 100 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-&àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]*$",
            message = "Từ khóa chỉ chấp nhận chữ, số, dấu cách, '-' và '&'")
    private String keyword;
    
    private Long categoryId;
    
    private Integer page = 0;
    
    private Integer size = 10;
}

