import { ReactNode, useState } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useToast,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import {
  FaCog,
  FaFlag,
  FaHome,
  FaUser,
  FaLocationArrow,
  FaBuilding,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FaHome, url: '#' },
  { name: 'Owners', icon: FaUser, url: 'owner-admin' },
  { name: 'Regions', icon: FaLocationArrow, url: 'regional-admin' },
  { name: 'Districts', icon: FaBuilding, url: 'district-admin' },
  { name: 'Farms', icon: FaFlag, url: 'destination-user' },
  { name: 'Settings', icon: FaCog, url: 'settings' },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p='4' bg='#FFF'>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const role = localStorage.getItem('role');

  return (
    <Box
      transition='3s ease'
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex
        h='20'
        alignItems='center'
        mx='8'
        justifyContent='space-between'
        marginBottom='16px'
      >
        <Box>
          <Image src='/logo.png' />
        </Box>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) =>
        role === 'super_admin' &&
        (link.name === 'Dashboard' ||
          link.name === 'Owners' ||
          link.name === 'Settings') ? (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ) : role === 'owner_admin' &&
          (link.name === 'Dashboard' ||
            link.name === 'Settings' ||
            link.name === 'Regions' ||
            link.name === 'Districts' ||
            link.name === 'Farms') ? (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ) : role === 'regional_admin' &&
          (link.name === 'Dashboard' ||
            link.name === 'Settings' ||
            link.name === 'Districts' ||
            link.name === 'Farms') ? (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ) : role === 'district_admin' &&
          (link.name === 'Dashboard' ||
            link.name === 'Farms' ||
            link.name === 'Settings') ? (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ) : (
          <></>
        ),
      )}
      {/* <Button
        gap={3}
        position="relative"
        top="67vh"
        width="26vh"
        bg="orange.500"
        _hover={{ background: "red" }}
        pr={4}
        onClick={() => {
          setIsLoading(true);
          if (localStorage) {
            localStorage.clear();
            navigate("/login");
            toast({ title: "Logged out successfully", status: "success" });
          } else {
            navigate("/login");
          }
        }}
      >
        {isLoading ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            Sign Out <FaSignOutAlt />
          </>
        )}
      </Button> */}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  url: string;
  children: ReactText;
}
const NavItem = ({ icon, url, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={`/dashboard/${url}`}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'yellow.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('edited_role');

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='outline'
        aria-label='open menu'
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize='2xl'
        fontFamily='monospace'
        fontWeight='bold'
      >
        CocoBod
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size='lg'
          variant='ghost'
          aria-label='open menu'
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition='all 0.3s'
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar size={'sm'} icon={<AiOutlineUser />} bg='yellow.500' />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems='flex-start'
                  spacing='1px'
                  ml='2'
                >
                  <Text fontSize='sm'>{username}</Text>
                  <Text fontSize='xs' color='gray.600'>
                    {role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem
                onClick={() => {
                  navigate('/dashboard/profile');
                }}
                _hover={{
                  bg: 'yellow.500',
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/dashboard/settings');
                }}
                _hover={{
                  bg: 'yellow.500',
                }}
              >
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  setIsLoading(true);
                  if (localStorage) {
                    localStorage.clear();
                    navigate('/');
                    toast({
                      title: 'Logged out successfully',
                      status: 'success',
                      isClosable: true,
                    });
                  } else {
                    navigate('/');
                  }
                }}
                _hover={{
                  bg: 'yellow.500',
                }}
              >
                {isLoading ? <Spinner /> : 'Sign out'}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
