import { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorLogin, setErrorLogin] = useState();

  const { loading, login } = useLogin();

  const validateForm = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email là bắt buộc");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Mật khẩu là bắt buộc");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await login(email, password, setErrorLogin);
      // navigate("/"); // Điều hướng đến trang chủ hoặc trang khác sau khi đăng nhập thành công
    }
  };

  return (
    <>
      <Dialog size="xs" open={true} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem] sm:max-w-[28rem] lg:max-w-[32rem]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant="h4" color="blue-gray">
                Đăng nhập
              </Typography>
              <Link to="/">
                <IconButton
                  variant="text"
                  color="gray"
                  size="sm"
                  className="rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </Link>
            </div>

            <Typography className="-mb-2" variant="h6">
              Email
            </Typography>
            <Input
              type="email"
              color="blue"
              label="Email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <Typography color="red" variant="small">
                {emailError}
              </Typography>
            )}

            <Typography className="-mb-2" variant="h6">
              Mật khẩu
            </Typography>
            <Input
              type="password"
              color="blue"
              label="Mật khẩu"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <Typography color="red" variant="small">
                {passwordError}
              </Typography>
            )}
          </CardBody>
          {errorLogin && (
            <Typography color="red" variant="small" className="mx-auto">
              {errorLogin}
            </Typography>
          )}
          <CardFooter className="pt-0">
            <Button
              color="blue"
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
            >
              Đăng nhập
            </Button>
            <Typography variant="small" className="mt-4 flex justify-center">
              Bạn chưa có tài khoản?
              <Link to={"/signup"}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  Đăng ký
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

export default Login;
