import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../core/environment';

export const CreateDistrictAdmin = () => {
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
  }

  interface OwnerData {
    message: Owner[];
  }

  interface UserData {
    id: number;
    password: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    last_login: null;
    num_logins: number;
    reset_initial_password: boolean;
    status: number;
    role: number;
    created_by: number;
    approved_by: number;
    groups: [];
    user_permissions: [];
  }

  interface DistrictAdmin {
    district_id: number;
    district_name: string;
    district_code: string;
    district_comment: string;
    owner: Owner;
    user: UserData;
  }

  interface DistrictAdminData {
    message: DistrictAdmin[];
  }

  const [districtName, setDistrictName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [ownerAdminId, setOwnerAdminId] = useState('');
  const [districtComment, setDistrictComment] = useState('');
  const [regionalAdmin, setRegionalAdmin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuspendOpen, setSuspendIsOpen] = useState(false);
  const [isReactivateOpen, setReactivateIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number>();

  const [ownerData, setOwnerData] = useState<OwnerData>();
  // const [regionalAdminData, setRegionalAdminData] = useState<RegionalAdmin[]>();
  const [districtAdminData, setDistrictAdminData] =
    useState<DistrictAdminData>();

  const toast = useToast();
  const navigate = useNavigate();

  const fetchDistrictAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/district/list-all-district-user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Network response was not ok!');
      }
      const districtAdmins = await response.json();
      setDistrictAdminData(districtAdmins);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  //   const fetchDistrictAdminById = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const id = localStorage.getItem('id');
  //       setIsLoading(true);
  //       const response = await fetch(
  //         `${apiBaseUrl}/api/v1/regions/list-all-district-user/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );
  //       if (!response.ok) {
  //         setIsLoading(false);
  //         throw new Error('Network response was not ok!');
  //       }
  //       const districtAdmins = await response.json();
  //       setDistrictAdminData(districtAdmins);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching data: ', err);
  //       setIsLoading(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/owner/list-all-owners/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Network response was not ok!');
      }
      const owners = await response.json();
      setOwnerData(owners);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchOwners();
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSuspendIsOpen(false);
    setReactivateIsOpen(false);
    fetchDistrictAdmins();
  }, []);

  useEffect(() => {
    fetchDistrictAdmins();
  }, []);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('districtName', districtName);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('districtComment', districtComment);
        formData.append('districtCode', districtCode);
        formData.append('ownerAdminId', ownerAdminId);
        formData.append('regionalAdmin', regionalAdmin);

        const response = await fetch(
          `${apiBaseUrl}/api/v1/district/create-district-user/`,
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
          setIsLoading(false);
          throw new Error(data.detail);
        } else {
          toast({
            title: `${data.message}`,
            status: 'success',
            isClosable: true,
          });
          closeModal();
          navigate('/dashboard/create-regional-admin');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error({ err });
        // toast({ title: `${err}`, status: 'error', isClosable: true });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    },
    [
      districtName,
      email,
      firstName,
      lastName,
      districtCode,
      ownerAdminId,
      districtComment,
      toast,
      closeModal,
      navigate,
      regionalAdmin,
    ],
  );

  const openReactivateModal = (id: number) => {
    setCurrentId(id);
    setReactivateIsOpen(true);
  };

  const reactivate = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/regions/reactivate-regional-admin/${currentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Network response was not ok!');
      }
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const openSuspendModal = (id: number) => {
    setCurrentId(id);
    setSuspendIsOpen(true);
  };

  const suspend = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/regions/suspend-regional-admin/${currentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Network response was not ok!');
      }
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
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
          District Admin
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
          Add District Admin
        </Button>
      </div>

      <div style={{ height: '87.5vh' }}>
        {districtAdminData ? (
          <>
            <TableContainer
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Table variant='striped' colorScheme='gray' maxWidth='160vh'>
                <Thead>
                  <Tr>
                    <Th>District ID</Th>
                    <Th>District Name</Th>
                    <Th>District Code</Th>
                    <Th>District Comment</Th>
                    <Th>Owner Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {districtAdminData?.message.map((data, index) => (
                    <React.Fragment key={index}>
                      <Tr>
                        <Td>{data.district_id}</Td>
                        <Td>{data.district_name}</Td>
                        <Td>{data.district_code}</Td>
                        <Td>{data.district_comment}</Td>
                        <Td>{data.owner?.owner_name}</Td>
                        <Td>
                          {data.user?.status === 2 && (
                            <Button
                              type='submit'
                              bg='yellow.500'
                              color={'white'}
                              _hover={{
                                background: 'yellow.300',
                              }}
                              onClick={() => openReactivateModal(data.user.id)}
                            >
                              Reactivate
                            </Button>
                          )}
                          {data.user?.status === 1 && (
                            <Button
                              color='yellow.500'
                              _hover={{
                                background: 'yellow.500',
                                color: 'white',
                              }}
                              variant='ghost'
                              onClick={() => openSuspendModal(data.user.id)}
                            >
                              Suspend
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Flex justifyContent='center' alignItems='center'>
            <Spinner size='xl' color='green.500' />
          </Flex>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Regional Admin</ModalHeader>
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
              <FormLabel>District Name</FormLabel>
              <Input
                type='text'
                placeholder='Enter district name'
                value={districtName}
                required={true}
                onChange={(ev) => setDistrictName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Email Address</FormLabel>
              <Input
                type='email'
                value={email}
                required={true}
                onChange={(ev) => setEmail(ev.currentTarget.value)}
                placeholder='example@xyz.com'
                mb={3}
              />

              <FormLabel>First Name</FormLabel>
              <Input
                placeholder='Enter first name'
                type='text'
                value={firstName}
                required={true}
                onChange={(ev) => setFirstName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder='Enter last name'
                type='text'
                value={lastName}
                required={true}
                onChange={(ev) => setLastName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>District Code</FormLabel>
              <Input
                placeholder='Enter district code'
                type='text'
                value={districtCode}
                required={true}
                onChange={(ev) => setDistrictCode(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Owner Admin Id</FormLabel>
              <Select
                placeholder='Select option'
                value={ownerAdminId || ''}
                required={true}
                onChange={(ev) => setOwnerAdminId(ev.currentTarget.value)}
                mb={3}
              >
                {ownerData?.message.map((item, index) => (
                  <option key={index} value={item.owner_id}>
                    {item.owner_name}
                  </option>
                ))}
              </Select>

              <FormLabel>Regional Admin Id</FormLabel>
              <Select
                placeholder='Select option'
                value={regionalAdmin}
                required={true}
                onChange={(ev) => setRegionalAdmin(ev.currentTarget.value)}
                mb={3}
              >
                {ownerData?.message.map((item, index) => (
                  <option key={index} value={item.owner_id}>
                    {item.owner_name}
                  </option>
                ))}
              </Select>

              <FormLabel>District Comment</FormLabel>
              <Textarea
                required={true}
                value={districtComment}
                onChange={(ev) => setDistrictComment(ev.currentTarget.value)}
                mb={3}
              />

              <Button
                type='submit'
                w='100%'
                bg='yellow.500'
                color={'white'}
                _hover={{
                  background: 'yellow.300',
                }}
                style={{
                  marginTop: 10,
                }}
                isLoading={isLoading}
                loadingText='Loading'
              >
                Submit
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              color='yellow.500'
              _hover={{
                background: 'yellow.500',
                color: 'white',
              }}
              variant='ghost'
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSuspendOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Suspend District Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you you want to suspend this District Admin?
          </ModalBody>
          <ModalFooter>
            <Button
              type='submit'
              bg='yellow.500'
              color={'white'}
              _hover={{
                background: 'yellow.300',
              }}
              isLoading={isLoading}
              loadingText='Suspending'
              onClick={suspend}
            >
              Suspend
            </Button>
            <Button
              color='yellow.500'
              _hover={{
                background: 'yellow.500',
                color: 'white',
              }}
              style={{
                marginLeft: 4,
              }}
              variant='ghost'
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isReactivateOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reactivate Regional Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you you want to reactivate this Regional Admin?
          </ModalBody>
          <ModalFooter>
            <Button
              type='submit'
              bg='yellow.500'
              color={'white'}
              _hover={{
                background: 'yellow.300',
              }}
              isLoading={isLoading}
              onClick={reactivate}
              loadingText='Reactivating'
            >
              Reactivate
            </Button>
            <Button
              color='yellow.500'
              _hover={{
                background: 'yellow.500',
                color: 'white',
              }}
              style={{
                marginLeft: 4,
              }}
              variant='ghost'
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
