import { Button, Card, CardBody, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const DashboardStatistics = () => {
  const username = localStorage.getItem('username');

  return (
    <React.Fragment>
      <Text fontSize={['xl', '2xl']}>Hello {username}, welcome!</Text>
      <Flex
        gap={12}
        justifyContent='center'
        align='center'
        height='84vh'
        flexDirection={['column', 'row']}
        // flexWrap='wrap'
      >
        {[
          'State',
          'Owner Admin',
          'Region Admin',
          'District Admin',
          'Destination Admin',
        ].map((adminType) => (
          <Card key={adminType} w='100%'>
            <CardBody>
              <Center>
                <Text>1</Text>
              </Center>
              <Center mb={4}>
                <Text>{adminType}</Text>
              </Center>
              <Center>
                <Button>Create {adminType}</Button>
              </Center>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </React.Fragment>
  );
};
