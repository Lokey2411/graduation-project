
# Công nghệ sử dụng

-  Fe: ReactJS + Tailwindcss + Typescript + optional

-  BE: NodeJS + Typescript + MongoDB

Optional: Một thư viện design có sẵn các component dùng chung có thể custom dựa trên tailwindcss

Gợi ý của admin:

-  Shadcn

-  Ant design

-  MUI

# Các chức năng chính trong dự án

Admin:

1.  Authentication

2.  Quản lý sản phẩm

3.  Quản lý người dùng

4.  Quản lý danh mục

5.  Quản lý đơn hàng

6.  Thêm, sửa, xóa sliders

User:

1.  Authentication

2.  Quản lý giỏ hàng

3.  Mua sắm

4.  Xem sản phẩm

5.  Thêm sản phẩm yêu thích

6.  Đánh giá sản phẩm

# Thiết kế bảng

1.  Users ( _id: string, username: string, email: string, password: string, phone: string, address: string, displayName: string, permission: string[])

2.  Products ( _id: string, name: string, categories: category[], images: string[], price: string, sizes: Size[], colors: string[], description: string )

3.  Categories ( _id: string, name: string, image: string, isNewArrival: boolean, description: string )

4.  Orders ( _id: string, userId: string, products: Product[], price: string, status: string, address: string)

5.  Favorites ( _id: string, userId: string, products:Product[] )

6.  Reviews (_id: string, productId: string, userId: string, rating: number, comment : string, images: string[])

7.  Sliders ( _id: string, image: string)

8.  Sales (_id: string, product: product, percentage: number, isFlashSale: boolean )

# Thiết kế router

1.  Trang chủ: /
    
2.  Đăng ký: /sign-up
    
3.  Đăng nhập: /sign-in
    
4.  Sản phẩm: /products
    
5.  Giỏ hàng: /carts
    
6.  Checkout: /payment
    
7.  Tài khoản: /profile
    
8.  About: /about
    
9.  Liên hệ: /contact
    
10.  Chi tiết sản phẩm: /product/:id
    

Router backend:

1. /users

2.  /products

3.  /categories

4.  /orders

5.  /favorites

6.  /reviews

7.  /sliders

8.  /sales

# Thiết kế git

1.  Nhánh main: CẤM PUSH LÊN NHÁNH NÀY
    
2.  Nhánh dev: Nhánh dành cho leader
    
3.  Nhánh feature/*: Nhánh gồm chức năng của tất cả
    

LƯU Ý: Ở từng nhánh của mỗi người, chỉ add file liên quan tới chức năng trên nhánh, sau đó tạo merge request vào nhánh dev tương ứng

# Cấu trúc folder của dự án

 -  FE
    

- **Public**: Ảnh, video, các file tĩnh

- **Src**: Thư mục chính chứa source code

	 - **/assets/css:** Thư mục chứa source css
   
	  - **/commons**: Thư mục chứa các common dùng lại ( hook, function , constant )
	   
	  -  **/contexts**: Thư mục chứa các context
	   
	   - **/pages**: Thư mục chứa các trang chính. Tên trang sẽ tương ứng với tên thư mục. Thư mục sẽ có file index.tsx để khai báo trang web, các
	   file tương ứng với các component không dùng lại
	   
	   - **/services**: Thư mục chứa các service api xử lý logic kéo api về từ server
	   
	   - **/types**: Thư mục chứa các interface, type reusable trong dự án
	   
	   - **/components**: Thư mục chứa các component dùng chung trong dự án

LƯU Ý:

-   Mỗi file chỉ export 1 biến / hàm ( common ) duy nhất
    
-   Các tên file sẽ tương ứng với tên của biến / hàm sẽ có export / export default trong file tương ứng. Ví dụ: ( dataProvider.ts, Button.tsx, … )
    
-   Không sử dụng type any trừ trường hợp catch error
    

2.  BE
    

Thư mục gốc: chứa config của dự án như tsconfig, package.json, lock file, gitignore, …

Src: Thư mục chứa source của dự án

Model: khai báo type của các model tương ứng

Service: gọi model từ mongodb về và trả về kết quả cho controller

Controller: controller của dự án tiếp nhận các body để gọi service

Routes: routes của dự án khai báo các route theo chuẩn rest api, map ra trong file index.ts

Middleware: Xử lý middleware của dự án

LƯU Ý:

-   Trả về mã lỗi, message rõ ràng không auto 500
    
-   Self-test bằng postman trước khi chốt api với front-end
    

# Nhiệm vụ của từng người

BE: Tú, Việt

FE:

Landing page: Đức, Hiếu

Admin: Việt Anh

# Các tài liệu liên quan

[Figma](https://www.figma.com/design/5zAH0vRrYAiRckduqCVPl9/Full-E-Commerce-Website-UI-UX-Design-(Community)?node-id=1-3&p=f&t=aMGTPENnHKECNO3Z-0)

[Git](https://github.com/Lokey2411/practice-shopify-project)