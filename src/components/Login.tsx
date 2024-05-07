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
} from "@chakra-ui/react";

import { FaLock, FaLockOpen, FaUser } from "react-icons/fa";

interface LoginProps {
    checkAuth: (password?: string) => Promise<boolean>;
    setAuthenticated: () => void;
    parseError: (err: unknown) => string;
}

export const Login: React.FC<LoginProps> = ({
  setAuthenticated,
}) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const response = await fetch('https://1539-41-80-116-101.ngrok-free.app/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailAddress, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        setAuthenticated();
      } catch (err: unknown) {
        console.error({ err });
        setError('Invalid username of password');
      }
    },
    [emailAddress, password, setAuthenticated]
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
            <InputGroup style={{ marginBottom: "1.5rem" }}>
              <Input
                placeholder="Email address"
                type="email"
                value={emailAddress}
                onChange={(ev) => setEmailAddress(ev.currentTarget.value)}
                required
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
                required
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaLock /> : <FaLockOpen />}
              </InputRightElement>
            </InputGroup>
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
