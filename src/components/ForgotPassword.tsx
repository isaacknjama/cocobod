import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  PinInput,
  PinInputField,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

import { apiBaseUrl } from '../core/environment';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/forget-password/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        localStorage.setItem('Email', email);
        toast({
          title: `OTP sent successfully to ${email}`,
          status: 'success',
        });
        navigate('/verify-otp');
      } catch (err: unknown) {
        console.error({ err });
        toast({ title: 'Error sending OTP!', status: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate, toast],
  );

  return (
    <Flex justifyContent='center' alignItems='center' height='100vh'>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' pt={8} gap={4}>
          <FormControl>
            <FormLabel style={{ fontWeight: 'bold' }}>
              Enter your email address
            </FormLabel>
            <InputGroup style={{ marginBottom: '1rem' }}>
              <Input
                autoComplete='off'
                placeholder='Email address'
                type='email'
                value={email}
                onChange={(ev) => setEmail(ev.currentTarget.value)}
                isRequired
                width='80vh'
              />
            </InputGroup>
            <Text style={{ marginBottom: '15px' }}>
              <Link href='/login' color='orange.500'>
                Sign in instead?
              </Link>
            </Text>
            <Button
              type='submit'
              bg='#000'
              style={{ width: '80vh', color: '#FFF' }}
              _hover={{
                background: 'orange.500',
              }}
            >
              {isLoading ? (
                <>
                  <Spinner />
                </>
              ) : (
                'Get OTP'
              )}
            </Button>
          </FormControl>
        </Flex>
      </form>
    </Flex>
  );
};

export const VerifyOtp = () => {
  const [otp, setOtp] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (otp: string) => {
      try {
        const email = localStorage.getItem('Email');
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/verify-change-password/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        navigate('/reset-password');
      } catch (err: unknown) {
        console.error('Error verifying OTP: ', err);
      }
    },
    [navigate],
  );

  const handleResendOtp = useCallback(async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const email = localStorage.getItem('Email');
      console.log(email);
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/resend-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      location.reload();
    } catch (err: unknown) {
      console.error('Error sending OTP: ', err);
    }
  }, []);

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={10}
      justifyContent='center'
      alignItems='center'
      height='100vh'
    >
      <Text as='b'>Enter OTP sent to your email address</Text>
      <HStack>
        <PinInput otp type='number' value={otp} onChange={(pin) => setOtp(pin)}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <ButtonGroup>
        <Button
          bg='#000'
          style={{ color: '#FFF', width: '15vh' }}
          _hover={{
            background: 'orange.500',
          }}
        >
          <Link href='/forgot-password'>Back</Link>
        </Button>
        <Button
          type='submit'
          bg='#000'
          style={{ color: '#FFF', width: '15vh' }}
          onClick={() => handleSubmit(otp)}
          _hover={{
            background: 'orange.500',
          }}
        >
          Next
        </Button>
      </ButtonGroup>
      <Text>
        Didn't receive OTP?{' '}
        <Link
          href='/verify-otp'
          color='orange.500'
          onClick={(e) => handleResendOtp(e)}
        >
          Resend
        </Link>
      </Text>
    </Box>
  );
};

export const ResetPassword: React.FC = () => {
  const [new_password, setNewPassword] = useState('');
  const [confirm_new_password, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        const email = localStorage.getItem('Email');
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/new-password/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, new_password, confirm_new_password }),
          },
        );
        const data = await response.json();
        localStorage.clear();
        navigate('/');
        if (!response.ok) {
          throw new Error(data.message);
        }
      } catch (err: unknown) {
        console.error({ err });
        setError('Invalid username of password');
      }
    },
    [new_password, confirm_new_password, navigate],
  );

  return (
    <Flex height='100vh' justifyContent='center' alignItems='center'>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' pt={8} gap={4}>
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
                width='60vh'
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
            style={{ color: '#FFF', width: '100%' }}
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
