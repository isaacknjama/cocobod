import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import SidebarWithHeader from './components/Dashboard';
import { ChangePassword, Login } from './components/Login';
import {
  ForgotPassword,
  ResetPassword,
  VerifyOtp,
} from './components/ForgotPassword';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { apiBaseUrl } from './core/environment';

function App() {
  const CreateNewOwner = () => {
    const [ownerLogo, setOwnerLogo] = useState<File | null>(null);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ownerDescription, setOwnerDescription] = useState('');
    const [ownerComment, setOwnerComment] = useState('');
    const [ownerCode, setOwnerCode] = useState('');
    const [serializeCodes, setSerializeCodes] = useState<string>('');
    const [allowIncidentTracking, setAllowIncidentTracking] =
      useState<string>('');
    const [batchCodeLength, setBatchCodeLength] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
      async (ev: React.FormEvent) => {
        ev.preventDefault();
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('ownerLogo', ownerLogo as File);
          formData.append('email', email);
          formData.append('firstName', firstName);
          formData.append('lastName', lastName);
          formData.append('ownerDescription', ownerDescription);
          formData.append('ownerComment', ownerComment);
          formData.append('ownerCode', ownerCode);
          formData.append('serializeCodes', String(serializeCodes));
          formData.append(
            'allowIncidentTracking',
            String(allowIncidentTracking),
          );
          formData.append('batchCodeLength', String(batchCodeLength));
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
        ownerLogo,
        email,
        firstName,
        lastName,
        ownerDescription,
        ownerComment,
        ownerCode,
        serializeCodes,
        allowIncidentTracking,
        batchCodeLength,
        toast,
        navigate,
      ],
    );

    return (
      <>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '70vh',
            height: '95vh',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            margin: 'auto',
          }}
          encType='multipart/form-data'
        >
          <>
            <FormLabel>Owner Logo</FormLabel>
            <Input
              type='file'
              accept='image/png, image/jpeg'
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                if (ev.target.files !== null) {
                  setOwnerLogo(ev.target.files[0]);
                }
              }}
              style={{
                marginBottom: '4px',
              }}
            />
          </>

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

          <FormLabel>Serialize Codes</FormLabel>
          <Select
            placeholder='Select option'
            value={serializeCodes || ''}
            onChange={(ev) => setSerializeCodes(ev.currentTarget.value)}
            mb={3}
          >
            <option value='true'>True</option>
            <option value='false'>False</option>
          </Select>

          <FormLabel>Allow Incident Tracking</FormLabel>
          <Select
            placeholder='Select option'
            value={allowIncidentTracking}
            onChange={(ev) => setAllowIncidentTracking(ev.currentTarget.value)}
            mb={3}
          >
            <option value='True'>True</option>
            <option value='False'>False</option>
          </Select>

          <FormLabel>Batch Code Length</FormLabel>
          <NumberInput
            value={batchCodeLength}
            onChange={(value) => setBatchCodeLength(parseInt(value))}
            mb={3}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button
            type='submit'
            w='70vh'
            bg='green.500'
            _hover={{
              background: 'yellow.500',
            }}
          >
            {isLoading ? (
              <>
                <Spinner color='yellow.500' />
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </>
    );
  };

  const ListAllOwners = () => {
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

    const [ownerData, setOwnerData] = useState<OwnerData>();
    const [ownerDetails, setOwnerDetails] = useState<[] | null>();
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
      const fetchOwners = async () => {
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
          setOwnerData(owners);
        } catch (err) {
          console.error('Error fetching data: ', err);
        }
      };

      fetchOwners();
    }, []);

    const fetchOwnerDetails = async (ownerId: number) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${apiBaseUrl}/api/v1/owner/describe-one-owner/${ownerId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Network response was not ok!');
        }
        const owner = await response.json();
        setOwnerDetails(owner);
      } catch (err) {
        console.error('Error fetching data: ', err);
      }
    };

    const handleToggleRow = async (ownerId: number) => {
      if (expandedRow === ownerId) {
        setExpandedRow(null);
        setOwnerDetails(null);
      } else {
        setExpandedRow(ownerId);
        await fetchOwnerDetails(ownerId);
      }
    };

    return (
      <div style={{ height: '87.5vh' }}>
        {/* {console.log('Owner data:', ownerData?.message)} */}
        {ownerData ? (
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
                    <Th>Owner ID</Th>
                    <Th>Owner Name</Th>
                    <Th>Owner Code</Th>
                    <Th>Batch Code Length</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ownerData?.message.map((data) => (
                    <React.Fragment key={data.owner_id}>
                      <Tr>
                        <Td>{data.owner_id}</Td>
                        <Td>{data.owner_name}</Td>
                        <Td>{data.owner_code}</Td>
                        <Td>{data.batch_code_length}</Td>
                        <Td>
                          <Link
                            onClick={() => handleToggleRow(data.owner_id)}
                            _hover={{
                              color: 'yellow.500',
                            }}
                            textDecoration='underline'
                          >
                            {expandedRow === data.owner_id
                              ? 'Hide details'
                              : 'See more details'}
                          </Link>
                        </Td>
                      </Tr>
                      {expandedRow === data.owner_id && (
                        <Card maxWidth='80vh' mt={2} maxH='84vh'>
                          <CardHeader>
                            <Heading size='md'>Owner Details</Heading>
                          </CardHeader>
                          {ownerDetails ? (
                            <CardBody>
                              <Flex gap={4} flexDirection='column'>
                                <Heading size='s'>Owner Logo</Heading>
                                <Box boxSize='sm'>
                                  <Image
                                    src={data.owner_logo}
                                    objectFit='cover'
                                    alt='Owner Logo'
                                  />

                                  <Heading size='s'>
                                    Allow Incident Tracking
                                  </Heading>
                                  <Text>
                                    {data.allow_incident_tracking
                                      ? 'True'
                                      : 'False'}
                                  </Text>
                                </Box>
                                <Box>
                                  <Heading size='s'>Batch Code Length</Heading>
                                  <Text>{data.batch_code_length}</Text>
                                </Box>
                                <Box>
                                  <Heading size='s'>Include District</Heading>
                                  <Text>
                                    {data.include_district ? 'True' : 'False'}
                                  </Text>
                                </Box>
                              </Flex>
                              <Stack
                                divider={<StackDivider />}
                                display='flex'
                                flexDirection='row'
                                gap={8}
                              >
                                <Box>
                                  <Heading size='s'>Include Region</Heading>
                                  <Text>
                                    {data.include_region ? 'True' : 'False'}
                                  </Text>
                                </Box>
                                <Box>
                                  <Heading size='s'>Owner Comment</Heading>
                                  <Text>{data.owner_comment}</Text>
                                </Box>
                                <Box>
                                  <Heading size='s'>Owner Description</Heading>
                                  <Text>{data.owner_description}</Text>
                                </Box>
                                <Box>
                                  <Heading size='s'>Serialise Codes</Heading>
                                  <Text>{data.serialise_codes}</Text>
                                </Box>
                              </Stack>
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
          <Flex justifyContent='center' alignItems='center'>
            <Spinner size='xl' color='green.500' />
          </Flex>
        )}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/dashboard'
          element={
            <SidebarWithHeader children={[<ListAllOwners key='owner' />]} />
          }
        />
        <Route
          path='/dashboard/create-owner'
          element={
            <SidebarWithHeader children={[<CreateNewOwner key='owner' />]} />
          }
        />
        <Route
          path='/dashboard/settings'
          element={<SidebarWithHeader children={[]} />}
        />
        <Route
          path='/dashboard/profile'
          element={<SidebarWithHeader children={[]} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
