import {
  Card,
  CardBody,
  CardHeader,
  Box,
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
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  Link,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../core/environment';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const CreateRegionalAdmin = () => {
  // interface Owner {
  //   owner_id: number;
  //   owner_name: string;
  //   owner_code: string;
  //   batch_code_length: number;
  //   owner_logo: string;
  //   allow_incident_tracking: string;
  //   include_district: string;
  //   include_region: string;
  //   owner_comment: string;
  //   owner_description: string;
  //   serialise_codes: string;
  // }

  // interface OwnerData {
  //   message: Owner[];
  // }

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

  interface RegionalAdmin {
    id: number;
    regionalAdmin_name: string;
    regionalAdmin_description: string;
    regionalAdmin_mobileNumber: string;
    regionalAdmin_email: string;
    user: UserData;
    region: number;
  }

  interface RegionalAdminData {
    message: RegionalAdmin[];
  }

  interface Region {
    region_id: number;
    region_name: string;
    region_code: string;
    region_comment: string;
    state: number;
  }

  interface RegionData {
    message: Region[];
  }

  const [regionName, setRegionName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regionId, setRegionId] = useState('');
  const [regionComment, setRegionComment] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSuspendOpen, setSuspendIsOpen] = useState(false);
  const [isReactivateOpen, setReactivateIsOpen] = useState(false);

  const [currentId, setCurrentId] = useState<number>();

  // const [ownerData, setOwnerData] = useState<OwnerData>();
  const [regionalAdminData, setRegionalAdminData] =
    useState<RegionalAdminData | null>();
  const [regionData, setRegionData] = useState<RegionData | null>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toast = useToast();
  // const navigate = useNavigate();

  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('stateId');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/regions/list-all-regions/${id}`,
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
      const regions = await response.json();
      setRegionData(regions);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegionalAdmins = async (ownerId: number) => {
    try {
      const token = localStorage.getItem('token');
      // const id = localStorage.getItem('id');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/regions/list-all-region-owners/${ownerId}`,
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
      const regionalAdmins = await response.json();
      setRegionalAdminData(regionalAdmins);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchOwners = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `${apiBaseUrl}/api/v1/owner/list-all-owners/`,
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
  //     const owners = await response.json();
  //     setOwnerData(owners);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error('Error fetching data: ', err);
  //     setIsLoading(false);
  //   }
  // };

  const openModal = () => {
    setIsOpen(true);
    // fetchOwners();
  };

  const openRegionModal = () => {
    setIsRegionOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsRegionOpen(false);
    setSuspendIsOpen(false);
    setReactivateIsOpen(false);
    fetchRegions();
  }, []);

  const handleToggleRow = async (ownerId: number) => {
    if (expandedRow === ownerId) {
      setExpandedRow(null);
      setRegionalAdminData(null);
    } else {
      setRegionalAdminData(null);
      setExpandedRow(ownerId);
      await fetchRegionalAdmins(ownerId);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('regionId', regionId);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('regionalAdminEmail', email);
        formData.append('regionComment', regionComment);
        formData.append('regionalAdminMobileNumber', mobileNumber);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/regions/create-regional-admin/`,
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
          // navigate('/dashboard/create-regional-admin');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error({ err });
        toast({ title: `${err}`, status: 'error', isClosable: true });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    },
    [
      regionId,
      email,
      firstName,
      lastName,
      mobileNumber,
      regionComment,
      toast,
      closeModal,
      // navigate,
    ],
  );

  const handleRegionSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('regionName', regionName);
        if (localStorage.getItem('stateId') !== null) {
          formData.append('stateId', localStorage.getItem('stateId')!);
        }
        formData.append('regionComment', regionComment);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/regions/create-region/`,
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
          // navigate('/dashboard/create-regional-admin');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error({ err });
        toast({ title: `${err}`, status: 'error', isClosable: true });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    },
    [regionName, regionComment, toast, closeModal],
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
          Regions
        </h1>
        <div style={{ flexGrow: 1 }}></div>
        <Button
          type='submit'
          bg='yellow.500'
          color={'white'}
          _hover={{
            background: 'yellow.300',
          }}
          mr={2}
          onClick={openRegionModal}
        >
          Add Region
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
          Add Regional Admin
        </Button>
      </div>

      <Box style={{ height: '87.5vh' }} p={4}>
        {regionData ? (
          <>
            <TableContainer
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
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
                    <Th>Region ID</Th>
                    <Th>Region Name</Th>
                    <Th>Region Comment</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {regionData?.message.map((data, index) => (
                    <React.Fragment key={index}>
                      <Tr>
                        <Td>{data.region_id}</Td>
                        <Td>{data.region_name}</Td>
                        <Td>{data.region_comment}</Td>
                        <Td>
                          <Link
                            onClick={() => handleToggleRow(data.region_id)}
                            _hover={{
                              color: 'yellow.500',
                            }}
                            textDecoration='underline'
                          >
                            {expandedRow === data.region_id ? (
                              <div style={{ display: 'flex' }}>
                                <FiChevronUp /> Hide Region Admins
                              </div>
                            ) : (
                              <div style={{ display: 'flex' }}>
                                <FiChevronDown /> See Region Admins
                              </div>
                            )}
                          </Link>
                        </Td>
                      </Tr>
                      {expandedRow === data.region_id && (
                        <Tr>
                          <Td colSpan={5} padding={0} borderBottom='none'>
                            <Card w={['100%']} mt={2} mb={2}>
                              <CardHeader>
                                <Heading size='md'>Region Admins</Heading>
                              </CardHeader>
                              {regionalAdminData ? (
                                <CardBody>
                                  <TableContainer
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
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
                                          <Th>Email</Th>
                                          <Th>Name</Th>
                                          <Th>Phone Number</Th>
                                          <Th>Actions</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {regionalAdminData?.message.map(
                                          (data, index) => (
                                            <React.Fragment key={index}>
                                              <Tr>
                                                <Td>
                                                  {data.regionalAdmin_email}
                                                </Td>
                                                <Td>
                                                  {data.regionalAdmin_name}
                                                </Td>
                                                <Td>
                                                  {
                                                    data.regionalAdmin_mobileNumber
                                                  }
                                                </Td>
                                                <Td>
                                                  {data.user?.status === 2 && (
                                                    <Button
                                                      type='submit'
                                                      bg='yellow.500'
                                                      color={'white'}
                                                      _hover={{
                                                        background:
                                                          'yellow.300',
                                                      }}
                                                      onClick={() =>
                                                        openReactivateModal(
                                                          data.user.id,
                                                        )
                                                      }
                                                    >
                                                      Reactivate
                                                    </Button>
                                                  )}
                                                  {data.user?.status === 1 && (
                                                    <Button
                                                      color='yellow.500'
                                                      _hover={{
                                                        background:
                                                          'yellow.500',
                                                        color: 'white',
                                                      }}
                                                      variant='ghost'
                                                      onClick={() =>
                                                        openSuspendModal(
                                                          data.user.id,
                                                        )
                                                      }
                                                    >
                                                      Suspend
                                                    </Button>
                                                  )}
                                                </Td>
                                              </Tr>
                                            </React.Fragment>
                                          ),
                                        )}
                                      </Tbody>
                                    </Table>
                                  </TableContainer>
                                </CardBody>
                              ) : (
                                <Spinner size='lg' color='green.500' />
                              )}
                            </Card>
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
          <Flex justifyContent='center' alignItems='center'>
            <Spinner size='xl' color='green.500' />
          </Flex>
        )}
      </Box>

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
                type='text'
                value={firstName}
                required={true}
                onChange={(ev) => setFirstName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                value={lastName}
                required={true}
                onChange={(ev) => setLastName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Mobile Number</FormLabel>
              <Input
                type='text'
                value={mobileNumber}
                required={true}
                onChange={(ev) => setMobileNumber(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Region</FormLabel>
              <Select
                placeholder='Select option'
                value={regionId || ''}
                required={true}
                onChange={(ev) => setRegionId(ev.currentTarget.value)}
                mb={3}
              >
                {regionData?.message.map((item, index) => (
                  <option key={index} value={item.region_id}>
                    {item.region_name}
                  </option>
                ))}
              </Select>

              <FormLabel>Region Comment</FormLabel>
              <Textarea
                required={true}
                value={regionComment}
                onChange={(ev) => setRegionComment(ev.currentTarget.value)}
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
      <Modal isOpen={isRegionOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Region</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleRegionSubmit}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                margin: 'auto',
              }}
              encType='multipart/form-data'
            >
              <FormLabel>Region Name</FormLabel>
              <Input
                type='text'
                value={regionName}
                required={true}
                onChange={(ev) => setRegionName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Region Comment</FormLabel>
              <Textarea
                required={true}
                value={regionComment}
                onChange={(ev) => setRegionComment(ev.currentTarget.value)}
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
          <ModalHeader>Suspend Regional Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you you want to suspend this Regional Admin?
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
