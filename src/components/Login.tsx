import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';

import { FaRegEye, FaRegEyeSlash, FaUser } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

import { apiBaseUrl } from '../core/environment';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>();

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
      setRememberMe(JSON.parse(rememberMe));
    }
  }, []);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response data: ', data);

        if (!response.ok) {
          toast({
            title: `${data.message}`,
            status: 'error',
            isClosable: true,
          });
          throw new Error(data.message || 'Login failed');
        }

        if (
          data.access_token !== undefined &&
          data.reset_initial_password === false
        ) {
          navigate('/change-password');
        } else if (data.access_token !== undefined) {
          toast({ title: 'Login successful', status: 'success' });
          navigate('/dashboard');
        } else {
          toast({
            title: data.error,
            status: 'error',
            isClosable: true,
          });
        }

        if (rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify(true));
        } else {
          localStorage.removeItem('rememberMe');
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('Email', email);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);
        localStorage.setItem('edited_role', data.edited_role);
        localStorage.setItem('username', data.username);

        if (data.access_token !== undefined) {
          toast({ title: 'Login successful', status: 'success' });
          navigate('/dashboard');
        } else {
          toast({
            title: 'Invalid credentials, please try again!',
            status: 'error',
          });
        }
      } catch (err: unknown) {
        console.error({ err });
        setError('Invalid username of password');
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate, password, rememberMe, toast],
  );

  return (
    <Flex height='100vh' justifyContent='center' alignItems='center'>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' align='start'>
          <Flex m='auto'>
            <Image
              src='/logo.png'
              alt='eBiashara Logo'
              boxSize='sm'
              height='100%'
              width='100%'
            />
          </Flex>
          <Flex direction='column' align='start'>
            <Heading size='md' fontWeight='bold'>
              Sign In
            </Heading>
          </Flex>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <InputGroup style={{ marginBottom: '1rem' }}>
              <Input
                placeholder='Email address'
                type='email'
                value={email}
                autoComplete='off'
                onChange={(ev) => setEmail(ev.currentTarget.value)}
                isRequired
                focusBorderColor='#651b0f'
              />
              <InputRightElement>
                <FaUser />
              </InputRightElement>
            </InputGroup>

            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(ev) => setPassword(ev.currentTarget.value)}
                isRequired
                focusBorderColor='#651b0f'
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </InputRightElement>
            </InputGroup>
            <Stack direction='row' spacing={40}>
              <Checkbox
                defaultChecked
                colorScheme='green'
                isChecked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </Checkbox>
              <Link
                href='/forgot-password'
                style={{
                  fontSize: '15px',
                  padding: '25px',
                  marginLeft: '282px',
                }}
                color='green'
                _hover={{
                  color: 'green',
                }}
                aria-label='forgot- password'
                // onClick={(e) => {
                //   e.preventDefault();
                //   setTimeout(() => {
                //     window.location.href = '/forgot-password';
                //   }, 500);
                // }}
              >
                Forgot Password?
              </Link>
            </Stack>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
            <Button
              bg='yellow.500'
              color='#FFF'
              type='submit'
              style={{ width: '100%' }}
              disabled={isLoading}
              _hover={{
                bg: 'yellow.500',
              }}
            >
              {isLoading ? (
                <>
                  <Spinner size='lg' />
                </>
              ) : (
                'Login'
              )}
            </Button>
          </FormControl>
        </Flex>
      </form>
    </Flex>
  );
};

export const ChangePassword = () => {
  const [new_password, setNewPassword] = useState('');
  const [confirm_new_password, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  const handleChangePassword = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const email = localStorage.getItem('Email');
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/reset-password-login/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, new_password, confirm_new_password }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        localStorage.clear();
        navigate('/login');
      } catch (err: unknown) {
        setError('Invalid username or password');
      }
    },
    [confirm_new_password, navigate, new_password],
  );

  return (
    <Flex height='100vh' justifyContent='center' alignItems='center'>
      <form onSubmit={handleChangePassword}>
        <Flex direction='column' pt={8} gap={4} align='start'>
          <Flex direction='column' align='start'>
            <Heading size='md' fontWeight='bold'>
              Reset Password
            </Heading>
          </Flex>
          <FormControl>
            <FormLabel>New password</FormLabel>
            <InputGroup>
              <Input
                placeholder='New Password'
                type={showPassword ? 'text' : 'password'}
                value={new_password}
                onChange={(ev) => setNewPassword(ev.currentTarget.value)}
                isRequired
                width='80vh'
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </InputRightElement>
            </InputGroup>
            <FormLabel>Confirm new password</FormLabel>
            <InputGroup>
              <Input
                placeholder='Confirm New Password'
                type={showPassword ? 'text' : 'password'}
                value={confirm_new_password}
                onChange={(ev) => setConfirmNewPassword(ev.currentTarget.value)}
                isRequired
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </InputRightElement>
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          <Button
            type='submit'
            bg='#000'
            style={{
              width: '100%',
              color: '#FFF',
            }}
            _hover={{
              background: 'orange.500',
            }}
          >
            Reset Password
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
