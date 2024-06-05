import {
  Box,
  Button,
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
  Select,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../core/environment';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Owner {
  owner_id: number;
  owner_name: string;
  owner_code: string;
  batch_code_length: number;
  owner_logo: string;
  allow_incident_tracking: string;
  include_district: string;
  include_region: string;
  owner_comment: string;
  owner_description: string;
  serialise_codes: string;
  owners: [];
}

interface OwnerData {
  message: Owner[];
}

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

export const CreateNewOwner = () => {
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [ownerId, setOwnerId] = useState<number>(1);
  const [stateId, setStateId] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ownerDescription, setOwnerDescription] = useState('');
  const [ownerComment, setOwnerComment] = useState('');
  const [ownerCode, setOwnerCode] = useState('');
  const [owner_mobileNumber, setOwnerMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [ownerDetails, setOwnerDetails] = useState<[] | null>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      setOwnerId(ownerId + 1);
      setStateId(stateId + 1);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('id', ownerId);
        formData.append('email', email);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('ownerDescription', ownerDescription);
        formData.append('ownerComment', ownerComment);
        formData.append('ownerCode', ownerCode);
        formData.append('owner_mobileNumber', owner_mobileNumber);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/owner/create-owner/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
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
          navigate('/dashboard');
        }
      } catch (err: unknown) {
        console.error({ err });
        toast({ title: `${err}`, status: 'error', isClosable: true });
      } finally {
        setIsLoading(false);
      }
    },
    [
      ownerId,
      email,
      firstName,
      lastName,
      ownerDescription,
      ownerComment,
      ownerCode,
      toast,
      navigate,
      owner_mobileNumber,
      stateId,
    ],
  );

  const fetchOwners = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/v1/owner/list-all-owners/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }
      const owners = await response.json();
      console.log(owners);
      setOwnerData(owners);
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  }, [setOwnerData]);

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
      console.log(states);
      setStateData(states);
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  }, [setStateData]);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const handleToggleRow = async (stateId: number) => {
    if (expandedRow === stateId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(stateId);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    fetchStates();
  }, [fetchStates]);

  // const openReactivateModal = (id: number) => {
  //   setCurrentId(id);
  //   setReactivateIsOpen(true);
  // };

  // const reactivate = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `${apiBaseUrl}/api/v1/regions/reactivate-regional-admin/${currentId}/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     if (!response.ok) {
  //       setIsLoading(false);
  //       throw new Error('Network response was not ok!');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching data: ', err);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //     closeModal();
  //   }
  // };

  // const openSuspendModal = (id: number) => {
  //   setCurrentId(id);
  //   setSuspendIsOpen(true);
  // };

  // const suspend = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `${apiBaseUrl}/api/v1/regions/suspend-regional-admin/${currentId}/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     if (!response.ok) {
  //       setIsLoading(false);
  //       throw new Error('Network response was not ok!');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching data: ', err);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //     closeModal();
  //   }
  // };

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
          Owner Admin
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
          mr={4}
        >
          Add State
        </Button>
        <Button
          type='submit'
          bg='yellow.500'
          color={'white'}
          _hover={{
            background: 'yellow.300',
          }}
          onClick={openModal}
        >
          Add Owner Admin
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
                          <Image src={data.logo} w={8} />
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
                        <Tr>
                          <Td colSpan={6}>
                            {ownerData ? (
                              <Table variant='simple' size='sm' mt={2}>
                                <Thead>
                                  <Tr>
                                    <Th>
                                      <Heading size='s'>Owner Name</Heading>
                                    </Th>
                                    <Th>
                                      <Heading size='s'>Mobile Number</Heading>
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {ownerData &&
                                    ownerData.message.map((data, index) => (
                                      <React.Fragment key={index}>
                                        {data.owners.map(
                                          (owner, ownerIndex) => (
                                            <Tr key={`${index}-${ownerIndex}`}>
                                              <Td>{owner.owner_name}</Td>
                                              <Td>
                                                {owner.owner_mobileNumber}
                                              </Td>
                                              <Td>
                                                <Button
                                                  bg='none'
                                                  _hover={{
                                                    bg: 'yellow.500',
                                                    color: '#FFF',
                                                  }}
                                                  variant='ghost'
                                                  onClick={() =>
                                                    openSuspendModal(
                                                      data.owners?.id,
                                                    )
                                                  }
                                                >
                                                  Reactivate
                                                </Button>
                                              </Td>
                                            </Tr>
                                          ),
                                        )}
                                      </React.Fragment>
                                    ))}
                                </Tbody>
                              </Table>
                            ) : (
                              <Spinner size='lg' color='green.500' />
                            )}
                          </Td>
                        </Tr>
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
          <ModalHeader>Add Owner Admin</ModalHeader>
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
              <FormLabel>Email Address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(ev) => setEmail(ev.currentTarget.value)}
                placeholder='example@xyz.com'
                mb={3}
              />

              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                value={firstName}
                onChange={(ev) => setFirstName(ev.currentTarget.value)}
                placeholder='First Name'
                mb={3}
              />

              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                value={lastName}
                onChange={(ev) => setLastName(ev.currentTarget.value)}
                placeholder='Last Name'
                mb={3}
              />

              <FormLabel>Owner Description</FormLabel>
              <Input
                type='text'
                value={ownerDescription}
                onChange={(ev) => setOwnerDescription(ev.currentTarget.value)}
                placeholder='Owner Description'
                mb={3}
              />

              <FormLabel>Owner Comment</FormLabel>
              <Input
                type='text'
                value={ownerComment}
                onChange={(ev) => setOwnerComment(ev.currentTarget.value)}
                placeholder='Owner Comment'
                mb={3}
              />

              <FormLabel>Owner Code</FormLabel>
              <Input
                type='text'
                value={ownerCode}
                onChange={(ev) => setOwnerCode(ev.currentTarget.value)}
                placeholder='Owner Code'
                mb={3}
              />

              <FormLabel>Mobile Number</FormLabel>
              <Stack spacing={4} mb={5}>
                <InputGroup>
                  <InputLeftAddon>+254</InputLeftAddon>
                  <Input
                    type='tel'
                    value={owner_mobileNumber}
                    placeholder='Phone Number'
                    onChange={(ev) =>
                      setOwnerMobileNumber(ev.currentTarget.value)
                    }
                  />
                </InputGroup>
              </Stack>

              <FormLabel>State</FormLabel>
              <Select mb={5} placeholder='Pick state...' />

              <Button
                type='submit'
                w='100%'
                bg='yellow.500'
                _hover={{
                  background: 'yellow.500',
                }}
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
              _hover={{
                background: 'yellow.500',
                color: '#FFF',
              }}
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
