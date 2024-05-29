import { Card, CardBody, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const DashboardStatistics = () => {
  const username = localStorage.getItem('username');

  return (
    <React.Fragment>
      <Text fontSize='2xl'>Hello {username} 👋, Welcome Back!</Text>
      <Flex gap={12} justifyContent='center' align='center' height='84vh'>
        <Card size='lg' width='25vh' variant='outline'>
          <CardBody>
            <Center>
              <Text>1</Text>
            </Center>
            <Center>
              <Text>Owner Admins</Text>
            </Center>
          </CardBody>
        </Card>
        <Card size='lg' width='25vh' variant='outline'>
          <CardBody>
            <Center>
              <Text>1</Text>
            </Center>
            <Center>
              <Text>Region Admins</Text>
            </Center>
          </CardBody>
        </Card>
        <Card size='lg' width='25vh' variant='outline'>
          <CardBody>
            <Center>
              <Text>1</Text>
            </Center>
            <Center>
              <Text>District Admins</Text>
            </Center>
          </CardBody>
        </Card>
        <Card size='lg' width='25vh' variant='outline'>
          <CardBody>
            <Center>
              <Text>1</Text>
            </Center>
            <Center>
              <Text>Destination Admins</Text>
            </Center>
          </CardBody>
        </Card>
      </Flex>
    </React.Fragment>
  );
};
