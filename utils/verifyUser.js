module.exports = ({ username, password }) => {
  let msg = [];
  if (username.length < 5) {
    msg.push({ username: 'Tên đăng nhập phải có ít nhất 5 kí tự' });
  }
  if (!/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])).{6,}/.test(password)) {
    msg.push({ password: 'Mật khẩu phải có tối thiểu 6 kí tự bao gồm 1 kí tự hoa, 1 kí tự số, 1 kí tự thường' });
  }
  return {
    isValid: msg.length === 0,
    msg: msg
  }
}