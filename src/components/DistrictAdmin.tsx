import {
  // Menu,
  // MenuButton,
  // MenuList,
  // MenuItem,
  Card,
  CardBody,
  CardHeader,
  Link,
  Heading,
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
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const CreateDistrictAdmin = () => {
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

  interface DistrictAdmin {
    districtAdmin_description: string;
    districtAdmin_email: string;
    districtAdmin_mobileNumber: string;
    districtAdmin_name: string;
    id: number;
    user: UserData;
  }

  interface DistrictAdminData {
    message: DistrictAdmin[];
  }

  interface District {
    district_id: number;
    district_name: string;
    district_code: string;
    district_comment: string;
    user: UserData;
  }

  interface DistrictData {
    message: District[];
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

  const [districtName, setDistrictName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [description, setdescription] = useState('');
  const [districtComment, setDistrictComment] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [regionId, setregionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const [isSuspendOpen, setSuspendIsOpen] = useState(false);
  const [isReactivateOpen, setReactivateIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const [regionFilterId, setregionFilterId] = useState('');

  const [districtAdminData, setDistrictAdminData] =
    useState<DistrictAdminData | null>();
  const [districtData, setDistrictData] = useState<DistrictData | null>();

  const [regionData, setRegionData] = useState<RegionData | null>();

  // const [searchTerm, setSearchTerm] = useState('');
  // const [selectedOption, setSelectedOption] = useState('');

  // const handleSelect = (option: string) => {
  //   setSelectedOption(option);
  //   setSearchTerm('');
  // };

  // const [filteredOptions, setfilteredOptions] = useState<string[] | null>();

  // let filteredOptions= [];

  // useEffect(() => {
  //   if (searchTerm !== null && regionData !== null) {
  //     setfilteredOptions(
  //       regionData?.message
  //         .filter((option: Region) =>
  //           option.region_name.toLowerCase().includes(searchTerm.toLowerCase()),
  //         )
  //         ?.map((element: Region) => element.region_name),
  //     );
  //   }
  // }, [regionData, searchTerm]);

  const toast = useToast();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

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
      localStorage.setItem('regionFilterId', regions.message[0].region_id);
      setregionFilterId(regions.message[0].region_id);
      setRegionData(regions);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistricts = async (value: string) => {
    try {
      const token = localStorage.getItem('token');
      // const id = localStorage.getItem('regionId');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/district/list-all-districts/${value}`,
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
      setDistrictData(regions);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFectDistricts = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setregionFilterId(event.target.value);
    await fetchDistricts(event.target.value);
  };

  const handleFectDistrictsModal = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setregionId(event.target.value);
    await fetchDistricts(event.target.value);
  };

  const fetchDistrictAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/district/list-all-district-user/${localStorage.getItem('currentId')}`,
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

  const openDistrictModal = () => {
    setIsDistrictOpen(true);
    localStorage.setItem('regionFilterId', regionFilterId);
  };

  const openModal = () => {
    setIsOpen(true);
    localStorage.setItem('regionFilterId', regionFilterId);
  };

  const closeModal = useCallback(async () => {
    setIsOpen(false);
    setSuspendIsOpen(false);
    setReactivateIsOpen(false);
    setIsDistrictOpen(false);
    if (role === 'owner_admin') {
      await fetchDistricts(localStorage.getItem('regionFilterId')!.toString());
    } else {
      await fetchDistricts(localStorage.getItem('regionId')!);
    }
    if (localStorage.getItem('currentId') !== null) {
      await fetchDistrictAdmins();
    }
  }, [role]);

  const handleToggleRow = async (ownerId: number) => {
    if (expandedRow === ownerId) {
      setExpandedRow(null);
      setDistrictAdminData(null);
    } else {
      setDistrictAdminData(null);
      setExpandedRow(ownerId);
      localStorage.setItem('currentId', ownerId.toString());
    }
  };

  useEffect(() => {
    fetchRegions().then(() => {
      if (role === 'owner_admin') {
        fetchDistricts(localStorage.getItem('regionFilterId')!.toString());
      } else {
        fetchDistricts(localStorage.getItem('regionId')!);
      }
    });
  }, [role]);

  useEffect(() => {
    if (expandedRow !== null) {
      fetchDistrictAdmins();
    }
  }, [expandedRow]);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('districtAdminEmail', email);
        formData.append('districtAdmin_description', description);
        formData.append('districtAdmin_mobileNumber', mobileNumber);
        formData.append('districtId', districtId);
        if (localStorage.getItem('id') !== null) {
          formData.append('ownerAdminId', localStorage.getItem('id')!);
        }
        if (role === 'owner_admin') {
          formData.append('regionalAdmin', regionId);
        } else {
          if (localStorage.getItem('regionId') !== null) {
            formData.append('regionalAdmin', localStorage.getItem('regionId')!);
          }
        }
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
          navigate('/dashboard/district-admin');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error({ err });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    },
    [
      email,
      firstName,
      lastName,
      mobileNumber,
      description,
      toast,
      regionId,
      role,
      closeModal,
      navigate,
      districtId,
    ],
  );

  const handleDistrictSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('districtName', districtName);
        if (localStorage.getItem('stateId') !== null) {
          formData.append('stateId', localStorage.getItem('stateId')!);
        }
        if (role === 'owner_admin') {
          formData.append('regionId', regionId);
        } else {
          if (localStorage.getItem('regionId') !== null) {
            formData.append('regionId', localStorage.getItem('regionId')!);
          }
        }
        formData.append('districtComment', districtComment);
        const response = await fetch(
          `${apiBaseUrl}/api/v1/district/create-district/`,
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
    [districtName, districtComment, toast, regionId, role, closeModal],
  );

  const openReactivateModal = (id: number) => {
    setCurrentId(id);
    setReactivateIsOpen(true);
    localStorage.setItem('regionFilterId', regionFilterId);
  };

  const reactivate = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/district/reactivate-district-user/${currentId}/`,
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
    localStorage.setItem('regionFilterId', regionFilterId);
  };

  const suspend = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/district/suspend-district-user/${currentId}/`,
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
        {/* <Box width='300px' mr={2}>
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} width='100%'>
              {selectedOption || 'Search Region'}
            </MenuButton>
            {filteredOptions !== null && (
              <MenuList>
                <Box px='4' pb='2'>
                  <Input
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(ev) => setSearchTerm(ev.currentTarget.value)}
                    mb='2'
                  />
                </Box>
                {filteredOptions?.map((option, index) => (
                  <MenuItem key={index} onClick={() => handleSelect(option)}>
                    {option}
                  </MenuItem>
                ))}
              </MenuList>
            )}
          </Menu>
        </Box> */}
        {role === 'owner_admin' && (
          <Select
            placeholder='Select option'
            value={regionFilterId}
            required={true}
            onChange={handleFectDistricts}
            mr={2}
          >
            {regionData?.message.map((item, index) => (
              <option key={index} value={item.region_id}>
                {item.region_name}
              </option>
            ))}
          </Select>
        )}
        <Button
          type='submit'
          bg='yellow.500'
          color={'white'}
          _hover={{
            background: 'yellow.300',
          }}
          mr={2}
          onClick={openDistrictModal}
        >
          Add District
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
          Add District Admin
        </Button>
      </div>

      <Box style={{ height: '87.5vh' }}>
        {districtData ? (
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
                size='sm'
                variant='striped'
                colorScheme='gray'
                w={['100%', '100%', '80%', '80%']}
                overflowX='visible'
              >
                <Thead>
                  <Tr>
                    <Th>District ID</Th>
                    <Th>District Name</Th>
                    <Th>District Comment</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {districtData?.message.map((data, index) => (
                    <React.Fragment key={index}>
                      <Tr>
                        <Td>{data.district_id}</Td>
                        <Td>{data.district_name}</Td>
                        <Td>{data.district_comment}</Td>
                        <Td>
                          <Link
                            onClick={() => handleToggleRow(data.district_id)}
                            _hover={{
                              color: 'yellow.500',
                            }}
                            textDecoration='underline'
                          >
                            {expandedRow === data.district_id ? (
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
                      {expandedRow === data.district_id && (
                        <Tr>
                          <Td colSpan={5} padding={0} borderBottom='none'>
                            <Card w={['100%']} mt={2} mb={2}>
                              <CardHeader>
                                <Heading size='md'>District Admins</Heading>
                              </CardHeader>
                              {districtAdminData ? (
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
                                        {districtAdminData?.message.map(
                                          (data, index) => (
                                            <React.Fragment key={index}>
                                              <Tr>
                                                <Td>
                                                  {data.districtAdmin_email}
                                                </Td>
                                                <Td>
                                                  {data.districtAdmin_name}
                                                </Td>
                                                <Td>
                                                  {
                                                    data.districtAdmin_mobileNumber
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
          <ModalHeader>Add District Admin</ModalHeader>
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

              <FormLabel>Mobile Number</FormLabel>
              <Input
                placeholder='Enter district code'
                type='text'
                value={mobileNumber}
                required={true}
                onChange={(ev) => setmobileNumber(ev.currentTarget.value)}
                mb={3}
              />

              {role === 'owner_admin' && (
                <>
                  <FormLabel>Region</FormLabel>
                  <Select
                    placeholder='Select option'
                    value={regionId}
                    required={true}
                    onChange={handleFectDistrictsModal}
                    mb={3}
                  >
                    {regionData?.message.map((item, index) => (
                      <option key={index} value={item.region_id}>
                        {item.region_name}
                      </option>
                    ))}
                  </Select>
                </>
              )}

              <FormLabel>District</FormLabel>
              <Select
                placeholder='Select option'
                value={districtId}
                required={true}
                onChange={(ev) => setdistrictId(ev.currentTarget.value)}
                mb={3}
              >
                {districtData?.message.map((item, index) => (
                  <option key={index} value={item.district_id}>
                    {item.district_name}
                  </option>
                ))}
              </Select>

              <FormLabel>Description</FormLabel>
              <Textarea
                required={true}
                value={description}
                onChange={(ev) => setdescription(ev.currentTarget.value)}
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
      <Modal isOpen={isDistrictOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add District</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleDistrictSubmit}
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
                value={districtName}
                required={true}
                onChange={(ev) => setDistrictName(ev.currentTarget.value)}
                mb={3}
              />

              {role === 'owner_admin' && (
                <>
                  <FormLabel>Region</FormLabel>
                  <Select
                    placeholder='Select option'
                    value={regionId}
                    required={true}
                    onChange={(ev) => setregionId(ev.currentTarget.value)}
                    mb={3}
                  >
                    {regionData?.message.map((item, index) => (
                      <option key={index} value={item.region_id}>
                        {item.region_name}
                      </option>
                    ))}
                  </Select>
                </>
              )}

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
