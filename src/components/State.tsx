import React, { useCallback, useEffect, useState } from 'react';
import { apiBaseUrl } from '../core/environment';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface State {
  state_id: number;
  name: string;
  support_email: string;
  support_mobileNumber: string;
  logo: string;
  description: string;
}

interface StateData {
  message: State[];
}

export const CreateState = () => {
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [name, setName] = useState('');
  const [support_email, setSupportEmail] = useState('');
  const [support_mobileNumber, setSupportMobileNumber] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('support_email', support_email);
        formData.append('support_mobileNumber', support_mobileNumber);
        formData.append('logo', logo as File);
        formData.append('description', description);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/owner/create-state/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
        console.log(formData);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          toast({
            title: `${data.message}`,
            status: 'error',
            isClosable: true,
          });
          throw new Error(data.detail);
        } else {
          toast({
            title: `${data.message}`,
            status: 'success',
            isClosable: true,
          });
        }
      } catch (err: unknown) {
        toast({ title: `${err}`, status: 'error', isClosable: true });
      } finally {
        setIsLoading(false);
      }
    },
    [description, logo, name, support_email, support_mobileNumber, toast],
  );

  const fetchStates = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/v1/owner/list-all-states`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }
      const states = await response.json();
      setStateData(states);
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  }, [setStateData]);

  const handleToggleRow = async (stateId: number) => {
    if (expandedRow === stateId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(stateId);
    }
  };

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    fetchStates();
  }, [fetchStates]);

  return (
    <React.Fragment>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            maxWidth: '160vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}
        ></div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          State
        </h1>
        <div style={{ flexGrow: 1 }}></div>
        <Button
          type='submit'
          bg='yellow.500'
          color={'white'}
          _hover={{
            background: 'yellow.300',
          }}
          onClick={openModal}
        >
          Add State
        </Button>
      </div>

      <Box height='87.5vh' p={4}>
        {stateData ? (
          <>
            <TableContainer
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Table
                variant='striped'
                colorScheme='gray'
                w={['100%', '100%', '80%', '80%']}
                overflowX='visible'
              >
                <Thead>
                  <Tr>
                    <Th>Logo</Th>
                    <Th>Name</Th>
                    <Th>Support Email</Th>
                    <Th>Support Mobile Number</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stateData?.message.map((data, index) => (
                    <React.Fragment key={`${data.state_id}-${index}`}>
                      <Tr>
                        <Td>
                          <Image src={data.logo} w={4} />
                        </Td>
                        <Td>{data.name}</Td>
                        <Td>{data.support_email}</Td>
                        <Td>{data.support_mobileNumber}</Td>
                        <Td>{data.description}</Td>
                        <Td>
                          <Link
                            onClick={() => handleToggleRow(data.state_id)}
                            _hover={{
                              color: 'yellow.500',
                            }}
                            textDecoration='underline'
                          >
                            {expandedRow === data.state_id ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </Link>
                        </Td>
                      </Tr>
                      {expandedRow === data.state_id && (
                        <Card
                          w={['100%', '90%', '80%', '60%']}
                          direction={{ base: 'column', sm: 'row' }}
                          overflow='hidden'
                          mt={2}
                        >
                          {stateData ? (
                            <CardBody>
                              <Heading size='s'>Owner Logo</Heading>
                              <Box boxSize='sm'>
                                <Image
                                  src={data.logo}
                                  objectFit='cover'
                                  alt='Owner Logo'
                                  boxSize={['100px', '150px']}
                                />
                              </Box>
                            </CardBody>
                          ) : (
                            <Spinner size='lg' color='green.500' />
                          )}
                        </Card>
                      )}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Flex justifyContent='center' alignItems='center' height='100%'>
            <Spinner size='xl' color='green.500' />
          </Flex>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add State</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                margin: 'auto',
              }}
              encType='multipart/form-data'
            >
              <FormLabel>Name</FormLabel>
              <Input
                type='text'
                value={name}
                placeholder='Enter name of state'
                onChange={(ev) => setName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Support Email</FormLabel>
              <Input
                type='email'
                value={support_email}
                placeholder='hello@xyz.com'
                onChange={(ev) => setSupportEmail(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Support Mobile Number</FormLabel>
              <Stack spacing={4} mb={3}>
                <InputGroup>
                  <InputLeftAddon>+254</InputLeftAddon>
                  <Input
                    type='tel'
                    value={support_mobileNumber}
                    placeholder='Enter support mobile number'
                    onChange={(ev) =>
                      setSupportMobileNumber(ev.currentTarget.value)
                    }
                  />
                </InputGroup>
              </Stack>

              <FormLabel>Logo</FormLabel>
              <Input
                type='file'
                accept='image/png, image/jpeg'
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                  if (ev.target.files !== null) {
                    setLogo(ev.target.files[0]);
                  }
                }}
                mb={3}
              />

              <FormLabel>Description</FormLabel>
              <Input
                type='text'
                value={description}
                placeholder='Description'
                onChange={(ev) => setDescription(ev.currentTarget.value)}
                mb={6}
              />

              <Button
                type='submit'
                w='100%'
                bg='yellow.500'
                _hover={{ background: 'yellow.500' }}
              >
                {isLoading ? (
                  <>
                    <Spinner color='green.500' />
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              color='yellow.500'
              _hover={{ background: 'yellow.500', color: '#FFF' }}
              variant='ghost'
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};
