import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { ChakraProvider } from '@chakra-ui/react'

const page = () => {
  return (
    <ChakraProvider>
      <Navbar />
      <Hero/>
    </ChakraProvider>

  )
}

export default page