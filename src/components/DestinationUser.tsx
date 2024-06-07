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
  // Tbody,
  // Td,
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

  interface DestinationUser {
    district: number;
    farm_code: string;
    farm_comment: string;
    farm_id: number;
    farm_name: string;
    region: number;
    state: number;
    user: UserData;
  }

  interface DestinationUserData {
    message: DestinationUser[];
  }

  const [farmName, setfarmName] = useState('');
  const [farmComment, setfarmComment] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [regionId, setregionId] = useState('');

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

  const [districtFilterId, setdistrictFilterId] = useState('');
  const [regionFilterId, setregionFilterId] = useState('');
  // const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const [regionData, setRegionData] = useState<RegionData>();
  const [districtData, setDistrictData] = useState<DistrictData>();
  const [destinationUserData, setdestinationUserData] =
    useState<DestinationUserData>();

  const toast = useToast();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  const fetchDestinationUsers = async (value: string) => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/v1/farms/list-farms/${value}`,
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
      const districts = await response.json();
      localStorage.setItem(
        'districtFilterId',
        districts.message[0].district_id,
      );
      setdistrictFilterId(districts.message[0].district_id);
      setDistrictData(districts);
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
    await fetchDestinationUsers(localStorage.getItem('districtFilterId')!);
  };

  const handleFectFarms = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setdistrictFilterId(event.target.value);
    await fetchDestinationUsers(event.target.value);
  };

  const handleFectDistrictsModal = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setregionId(event.target.value);
    await fetchDistricts(event.target.value);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openIncidentModal = () => {
    setIsIncidenceOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsIncidenceOpen(false);
    if (role === 'district_admin') {
      fetchDestinationUsers(localStorage.getItem('districtId')!);
    } else {
      fetchDestinationUsers(localStorage.getItem('districtFilterId')!);
    }
  }, [role]);

  useEffect(() => {
    if (role === 'owner_admin') {
      fetchRegions().then(() => {
        fetchDistricts(localStorage.getItem('regionFilterId')!).then(() => {
          fetchDestinationUsers(localStorage.getItem('districtFilterId')!);
        });
      });
    } else if (role === 'regional_admin') {
      fetchDistricts(localStorage.getItem('regionId')!).then(() => {
        fetchDestinationUsers(localStorage.getItem('districtFilterId')!);
      });
    } else {
      fetchDestinationUsers(localStorage.getItem('districtId')!);
    }
  }, [role]);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('farmName', farmName);
        formData.append('stateId', localStorage.getItem('stateId')!);

        if (role == 'owner_admin') {
          formData.append('regionId', regionId);
        } else {
          formData.append('regionId', localStorage.getItem('regionId')!);
        }

        if (role == 'owner_admin' || role == 'regional_admin') {
          formData.append('districtId', districtId);
        } else {
          formData.append('districtId', localStorage.getItem('districtId')!);
        }

        formData.append('farmComment', farmComment);

        const response = await fetch(
          `${apiBaseUrl}/api/v1/farms/create-farm/`,
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
          navigate('/dashboard/destination-user');
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
      farmName,
      farmComment,
      regionId,
      districtId,
      toast,
      role,
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
        {role === 'owner_admin' && (
          <Select
            placeholder='Select Region'
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
        {(role === 'owner_admin' || role === 'regional_admin') && (
          <Select
            placeholder='Select District'
            value={districtFilterId}
            required={true}
            onChange={handleFectFarms}
            mr={2}
          >
            {districtData?.message.map((item, index) => (
              <option key={index} value={item.district_id}>
                {item.district_name}
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
          Add Farm
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
                    <Th>Farm ID</Th>
                    <Th>Farm Name</Th>
                    <Th>Farm Code</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                {/* <Tbody>
                  {destinationUserData?.message.map((data, index) => (
                    <React.Fragment key={index}>
                      <Tr>
                        <Td>{data.farm_id}</Td>
                        <Td>{data.farm_name}</Td>
                        <Td>{data.farm_code}</Td>
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
                    </React.Fragment>
                  ))}
                </Tbody> */}
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
          <ModalHeader>Add Farm</ModalHeader>
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
              <FormLabel>Farm Name</FormLabel>
              <Input
                type='text'
                value={farmName}
                required={true}
                onChange={(ev) => setfarmName(ev.currentTarget.value)}
                mb={3}
              />

              {role === 'owner_admin' && (
                <>
                  <FormLabel>Region</FormLabel>
                  <Select
                    placeholder='Select option'
                    value={regionId || ''}
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

              {(role === 'owner_admin' || role === 'regional_admin') && (
                <>
                  <FormLabel>District</FormLabel>
                  <Select
                    placeholder='Select option'
                    value={districtId || ''}
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
                </>
              )}

              <FormLabel>Farm Comment</FormLabel>
              <Textarea
                required={true}
                value={farmComment}
                onChange={(ev) => setfarmComment(ev.currentTarget.value)}
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
