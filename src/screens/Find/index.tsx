import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { api } from '../../services/api';

export const Find = () => {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [poll, setPoll] = useState([]);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: 'Digite o código do bolão.',
          placement: 'bottom',
          bgColor: 'red.500',
        });
      }

      await api.post('/polls/join', { code });

      toast.show({
        title: 'Você entrou no bolão!',
        placement: 'bottom',
        bgColor: 'green.500',
      });

      navigate('polls');
    } catch (error) {
      if (error.response?.data?.message) {
        return toast.show({
          title: error.response.data.message,
          placement: 'bottom',
          bgColor: 'red.500',
        });
      }

      return toast.show({
        title: 'Não foi possível encontrar o bolão.',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por Código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão atráves de {'\n'} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Digite o código do bolão"
          value={code}
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  );
};
