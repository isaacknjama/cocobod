import { useCallback, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";

import { FaLock, FaLockOpen, FaUser } from "react-icons/fa";

interface LoginProps {
  checkAuth: (password?: string) => Promise<boolean>;
  setAuthenticated: () => void;
  parseError: (err: unknown) => string;
}

export const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const response = await fetch(
          "http://3.249.36.197:8000/api/v1/auth/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        setAuthenticated();
      } catch (err: unknown) {
        console.error({ err });
        setError("Invalid username of password");
      }
    },
    [email, password, setAuthenticated]
  );

  return (
    <Flex height="100vh" justifyContent="center" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" pt={8} gap={4} align="start">
          <Flex direction="column" align="start">
            <Heading size="md" fontWeight="medium">
              Login
            </Heading>
          </Flex>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <InputGroup style={{ marginBottom: "1rem" }}>
              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.currentTarget.value)}
                isRequired
                width="100%"
              />
              <InputRightElement>
                <FaUser />
              </InputRightElement>
            </InputGroup>

            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(ev) => setPassword(ev.currentTarget.value)}
                isRequired
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaLock /> : <FaLockOpen />}
              </InputRightElement>
            </InputGroup>
            <Link
              href="/forgot-password"
              style={{
                fontSize: "14px",
                paddingLeft: "160px",
              }}
              _hover={{
                color: 'red'
              }}
            >
              Forgot Password?
            </Link>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          <Button type="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
