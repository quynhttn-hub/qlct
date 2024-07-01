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
  avatar,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmpasswordError] = useState("");
  const [picError, setPicError] = useState("");
  const [verifiError, setVerifiError] = useState("");

  const { loading, signup } = useSignup();

  const validateForm = () => {
    let valid = true;

    if (!name) {
      setNameError("Tên đăng nhập là bắt buộc");
      valid = false;
    } else {
      setNameError("");
    }

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

    if (!confirmpassword) {
      setConfirmpasswordError("Xác nhận mật khẩu là bắt buộc");
      valid = false;
    } else if (password !== confirmpassword) {
      setConfirmpasswordError("Mật khẩu không khớp");
      valid = false;
    } else {
      setConfirmpasswordError("");
    }

    return valid;
  };

  const submitHandler = async () => {
    if (validateForm()) {
      await signup({
        username: name,
        email,
        password,
        confirmPassword: confirmpassword,
        avatar: pic,
        setVerifiError,
      });
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      setPicError("Không có hình ảnh nào được chọn");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
          setPicError("");
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      setPicError("Vui lòng chọn tệp ảnh (jpeg hoặc png)");
      setPicLoading(false);
      return;
    }
  };

  return (
    <>
      <Dialog size="xs" open={true} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem] sm:max-w-[28rem] lg:max-w-[32rem]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant="h4" color="blue-gray">
                Đăng ký
              </Typography>
              <Link to="/">
                <IconButton
                  variant="text"
                  color="gray"
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
              Tên đăng nhập
            </Typography>
            <Input
              color="blue"
              label="Tên đăng nhập"
              size="lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <Typography color="red" variant="small">
                {nameError}
              </Typography>
            )}

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

            <Typography className="-mb-2" variant="h6">
              Xác nhận mật khẩu
            </Typography>
            <Input
              type="password"
              color="blue"
              label="Xác nhận mật khẩu"
              size="lg"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            {confirmpasswordError && (
              <Typography color="red" variant="small">
                {confirmpasswordError}
              </Typography>
            )}

            <Typography className="-mb-2" variant="h6">
              Ảnh đại diện
            </Typography>
            <Input
              type="file"
              p={1.5}
              className="disabled:bg-none"
              accept="image/*"
              size="lg"
              label="Ảnh đại diện"
              color="blue"
              onChange={(e) => postDetails(e.target.files[0])}
            />
            {picError && (
              <Typography color="red" variant="small">
                {picError}
              </Typography>
            )}
          </CardBody>
          {verifiError && (
            <Typography color="red" variant="small" className="text-center">
              {verifiError}
            </Typography>
          )}
          <CardFooter className="pt-0">
            <Button
              color="blue"
              fullWidth
              onClick={submitHandler}
              disabled={loading || picLoading}
            >
              Đăng ký
            </Button>
            <Typography variant="small" className="mt-4 flex justify-center">
              Bạn đã có tài khoản
              <Link to={"/login"}>
                <Typography
                  as="a"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  Đăng nhập
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

export default Signup;
