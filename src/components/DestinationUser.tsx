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
  ChakraProvider,
  Box,
  FormControl,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../core/environment';
import { format } from 'date-fns';

export const DestinationUser = () => {
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

  interface RegionalAdmin {
    region_id: number;
    region_name: string;
    region_code: string;
    region_comment: string;
    user: UserData;
    owner_name: string;
    owner: number;
  }

  interface RegionalAdminData {
    message: RegionalAdmin[];
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

  interface DestinationUser {
    region: RegionalAdmin;
    owner: Owner;
    district: DistrictAdmin;
    destination_id: number;
    destination_name: string;
    destination_comment: string;
    destination_code: string;
    user: UserData;
  }

  interface DestinationUserData {
    message: DestinationUser[];
  }

  const [destinationName, setdestinationName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [destinationComment, setdestinationComment] = useState('');
  const [destinationCode, setdestinationCode] = useState('');
  const [ownerAdminId, setOwnerAdminId] = useState('');
  const [districtAdmin, setdistrictAdmin] = useState('');
  const [regionalAdmin, setregionalAdmin] = useState('');

  const [productName, setproductName] = useState('');
  const [brand, setbrand] = useState('');
  const [category, setcategory] = useState('');
  const [batchNumber, setbatchNumber] = useState('');
  const [manufactureDate, setmanufactureDate] = useState<Date | null>(null);
  const [expiryDate, setexpiryDate] = useState<Date | null>(null);
  const [barcodeSerialNumber, setbarcodeSerialNumber] = useState('');
  const [incidentDescription, setincidentDescription] = useState('');
  const [severity, setseverity] = useState('');
  const [status, setstatus] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isIncidenceOpen, setIsIncidenceOpen] = useState(false);

  const [isSuspendOpen, setSuspendIsOpen] = useState(false);
  const [isReactivateOpen, setReactivateIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number>();

  const [ownerData, setOwnerData] = useState<OwnerData>();
  const [regionalAdminData, setRegionalAdminData] =
    useState<RegionalAdminData>();
  const [districtAdminData, setDistrictAdminData] =
    useState<DistrictAdminData>();
  const [destinationUserData, setdestinationUserData] =
    useState<DestinationUserData>();

  const toast = useToast();
  const navigate = useNavigate();

  const fetchDestinationUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/destination/list-all-destination-user/`,
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
      const destinationUsers = await response.json();
      setdestinationUserData(destinationUsers);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchRegionalAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/regions/list-all-region-owners/${id}`,
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

  const openModal = () => {
    setIsOpen(true);
    fetchOwners();
    fetchRegionalAdmins();
    fetchDistrictAdmins();
  };

  const openIncidentModal = () => {
    setIsIncidenceOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSuspendIsOpen(false);
    setReactivateIsOpen(false);
    setIsIncidenceOpen(false);
    fetchDestinationUsers();
  }, []);

  useEffect(() => {
    fetchDestinationUsers();
  }, []);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('destinationName', destinationName);
        formData.append('email', email);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('destinationComment', destinationComment);
        formData.append('destinationCode', destinationCode);
        formData.append('ownerAdminId', ownerAdminId);
        formData.append('regionalAdmin', regionalAdmin);
        formData.append('districtAdmin', districtAdmin);

        const response = await fetch(
          `${apiBaseUrl}/api/v1/destination/create-destination-user/`,
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
          navigate('/dashboard/create-destination-user');
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
      destinationName,
      email,
      firstName,
      lastName,
      destinationComment,
      destinationCode,
      ownerAdminId,
      regionalAdmin,
      districtAdmin,
      toast,
      closeModal,
      navigate,
    ],
  );

  const handleIncidenceSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('product_name', productName);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('batch_number', batchNumber);
        formData.append(
          'manufacture_date',
          format(manufactureDate!, 'yyyy-MM-dd'),
        );
        formData.append('expiry_date', format(expiryDate!, 'yyyy-MM-dd'));
        formData.append('barcode_serial_number', barcodeSerialNumber);
        formData.append('incident_description', incidentDescription);
        formData.append('severity', severity);
        formData.append('status', status);

        const response = await fetch(
          `${apiBaseUrl}/api/v1/incident-reports/create-incident-report/`,
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
          navigate('/dashboard/create-destination-user');
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
      productName,
      brand,
      category,
      batchNumber,
      manufactureDate,
      expiryDate,
      barcodeSerialNumber,
      incidentDescription,
      severity,
      status,
      toast,
      closeModal,
      navigate,
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
        `${apiBaseUrl}/api/v1/destination/reactivate-destination-user/${currentId}/`,
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
        `${apiBaseUrl}/api/v1/destination/suspend-destination-user/${currentId}/`,
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
          Destination Users
        </h1>
        <div style={{ flexGrow: 1 }}></div>
        <Button
          type='submit'
          bg='yellow.500'
          color={'white'}
          _hover={{
            background: 'yellow.300',
          }}
          style={{
            marginRight: 5,
          }}
          onClick={openIncidentModal}
        >
          Report Incident
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
          Add Destination User
        </Button>
      </div>

      <div style={{ height: '87.5vh' }}>
        {destinationUserData ? (
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
                    <Th>Destination ID</Th>
                    <Th>Destination Name</Th>
                    <Th>Destination Code</Th>
                    <Th>Region Name</Th>
                    <Th>Owner Name</Th>
                    <Th>District Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {destinationUserData?.message.map((data, index) => (
                    <React.Fragment key={index}>
                      <Tr>
                        <Td>{data.destination_id}</Td>
                        <Td>{data.destination_name}</Td>
                        <Td>{data.destination_code}</Td>
                        <Td>{data.region.region_name}</Td>
                        <Td>{data.owner.owner_name}</Td>
                        <Td>{data.district.district_name}</Td>
                        <Td>
                          {data.user.status === 2 && (
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
                          {data.user.status === 1 && (
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
          <ModalHeader>Add Destination User</ModalHeader>
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
              <FormLabel>Destination Name</FormLabel>
              <Input
                type='text'
                value={destinationName}
                required={true}
                onChange={(ev) => setdestinationName(ev.currentTarget.value)}
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

              <FormLabel>Destination Code</FormLabel>
              <Input
                type='text'
                value={destinationCode}
                required={true}
                onChange={(ev) => setdestinationCode(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Owner Admin</FormLabel>
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

              <FormLabel>Regional Admin</FormLabel>
              <Select
                placeholder='Select option'
                value={regionalAdmin || ''}
                required={true}
                onChange={(ev) => setregionalAdmin(ev.currentTarget.value)}
                mb={3}
              >
                {regionalAdminData?.message.map((item, index) => (
                  <option key={index} value={item.region_id}>
                    {item.region_name}
                  </option>
                ))}
              </Select>

              <FormLabel>District Admin</FormLabel>
              <Select
                placeholder='Select option'
                value={districtAdmin || ''}
                required={true}
                onChange={(ev) => setdistrictAdmin(ev.currentTarget.value)}
                mb={3}
              >
                {districtAdminData?.message.map((item, index) => (
                  <option key={index} value={item.district_id}>
                    {item.district_name}
                  </option>
                ))}
              </Select>

              <FormLabel>Destination Comment</FormLabel>
              <Textarea
                required={true}
                value={destinationComment}
                onChange={(ev) => setdestinationComment(ev.currentTarget.value)}
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
          <ModalHeader>Suspend Destination User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you you want to suspend this Destination User?
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
          <ModalHeader>Reactivate Destination User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you you want to reactivate this Destination User?
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
      <Modal isOpen={isIncidenceOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Incidence Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleIncidenceSubmit}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                margin: 'auto',
              }}
              encType='multipart/form-data'
            >
              <FormLabel>Product Name</FormLabel>
              <Input
                type='text'
                value={productName}
                required={true}
                onChange={(ev) => setproductName(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Brand</FormLabel>
              <Input
                type='text'
                value={brand}
                required={true}
                onChange={(ev) => setbrand(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Category</FormLabel>
              <Input
                type='text'
                value={category}
                required={true}
                onChange={(ev) => setcategory(ev.currentTarget.value)}
                mb={3}
              />

              <FormLabel>Batch Number</FormLabel>
              <Input
                type='text'
                value={batchNumber}
                required={true}
                onChange={(ev) => setbatchNumber(ev.currentTarget.value)}
                mb={3}
              />

              <ChakraProvider>
                <Box maxW='md' mt={5}>
                  <FormControl>
                    <FormLabel htmlFor='date'>Manufacture Date</FormLabel>
                    <DatePicker
                      id='date'
                      selected={manufactureDate}
                      onChange={(date: Date | null) => setmanufactureDate(date)}
                      customInput={<Input />}
                      dateFormat='yyyy-MM-dd'
                    />
                  </FormControl>
                </Box>
              </ChakraProvider>

              <ChakraProvider>
                <Box maxW='md' mt={5} mb={5} style={{ width: '100%' }}>
                  <FormControl style={{ width: '100%' }}>
                    <FormLabel htmlFor='date'>Expiry Date</FormLabel>
                    <DatePicker
                      id='date'
                      selected={expiryDate}
                      onChange={(date: Date | null) => setexpiryDate(date)}
                      customInput={<Input style={{ width: '100%' }} />}
                      dateFormat='yyyy-MM-dd'
                    />
                  </FormControl>
                </Box>
              </ChakraProvider>

              <FormLabel>Barcode Serial Number</FormLabel>
              <Input
                type='number'
                value={barcodeSerialNumber}
                required={true}
                onChange={(ev) =>
                  setbarcodeSerialNumber(ev.currentTarget.value)
                }
                mb={3}
              />

              <FormLabel>Status</FormLabel>
              <Select
                placeholder='Select option'
                value={status || ''}
                required={true}
                onChange={(ev) => setstatus(ev.currentTarget.value)}
                mb={3}
              >
                <option value='Reported'>Reported</option>
                <option value='Not Reported'>Not Reported</option>
              </Select>

              <FormLabel>Severity</FormLabel>
              <Select
                placeholder='Select option'
                value={severity || ''}
                required={true}
                onChange={(ev) => setseverity(ev.currentTarget.value)}
                mb={3}
              >
                <option value='Low'>Low</option>
                <option value='Medium'>Medium</option>
                <option value='High'>High</option>
              </Select>

              <FormLabel>Incident Description</FormLabel>
              <Textarea
                required={true}
                value={incidentDescription}
                onChange={(ev) =>
                  setincidentDescription(ev.currentTarget.value)
                }
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
    </>
  );
};
