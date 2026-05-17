// src/utils/logger.ts
//hỗ trợ mình để ghi log ra file và in ra console, giúp mình theo dõi được các bước thực hiện trong test case, cũng như tên của test case đang chạy

//đầu tiên cần phải có file logger.ts để chứa các hàm ghi log, mình sẽ có 2 hàm chính là logStep và logTitle, trong đó logStep sẽ dùng để ghi lại các bước thực hiện trong test case, giống như click vào element nào đó hoặc nhập giá trị nào đó, còn logTitle sẽ dùng để ghi lại tên của test case đang chạy, giúp mình dễ dàng theo dõi hơn khi chạy nhiều test case cùng lúc
import chalk from "chalk";
import fs from "fs";
import path from "path";

//trước hết là mình sẽ tạo ra 1 folder logs để chứa các file log, mỗi lần chạy test sẽ tạo ra 1 file log mới với tên có chứa timestamp để phân biệt, ví dụ như test-log-2024-06-17T10-30-00.log, trong đó dấu : và . sẽ được thay bằng - để tránh lỗi khi tạo file trên Windows
//nó nằm ở ngoài folder lớn nhất của project, cùng cấp với folder tests, helpers, pages,... để dễ quản lý và tránh bị xóa nhầm khi xóa node_modules hoặc các folder khác
const logDir = path.join(process.cwd(), "logs");

//kiểm tra xem nó đã tồn tại chưa, nếu chưa thì tạo mới, nếu đã tồn tại rồi thì thôi, tránh bị lỗi khi chạy lần đầu tiên hoặc khi xóa folder logs đi mà quên tạo lại
// Tạo folder logs nếu chưa có
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
// logFile nghĩa là giống như mình mỗi lần chạy test nó sẽ tạo ra 1 file log duy nhất và mình sẽ lưu ngày tháng giờ của nó vào tên file để dễ phân biệt, ví dụ như test-log-2024-06-17T10-30-00.log, trong đó dấu : và . sẽ được thay bằng - để tránh lỗi khi tạo file trên Windows
const logFile = path.join(logDir, `test-log-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);

// Ghi log step: dùng để ghi lại các bước thực hiện trong test, giống như click vào element nào đó hoặc nhập giá trị nào đó
export function logStep(message: string) {
    const time = new Date().toISOString();
    const fullMessage = `[${time}] ${message}\n`;
    fs.appendFileSync(logFile, fullMessage);  // ghi vào file chung
    console.log(fullMessage.trim());          // vẫn in ra console
}

// Ghi log title mình sẽ log ra cái tên của test case
export function logTitle(message: string) {
    const separator = "-".repeat(100);
    const time = new Date().toISOString();
    console.log(chalk.yellow(separator));
    console.log(chalk.yellow(message));
    console.log(chalk.yellow(separator));
    // file output without chalk (just plain text)
    const fileMessage = `[${time}] ${separator}\n[${time}] ${message}\n[${time}] ${separator}\n`;
    fs.appendFileSync(logFile, fileMessage);
}