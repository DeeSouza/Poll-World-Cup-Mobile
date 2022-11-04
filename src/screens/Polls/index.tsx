import { useEffect, useState, useCallback } from 'react';
import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { EmptyPollList } from '../../components/EmptyPollList';
import { PollCard, PollCardPros } from '../../components/PollCard';

import { api } from '../../services/api';

export const Polls = () => {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [polls, setPolls] = useState<PollCardPros[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchPolls() {
    try {
      setIsLoading(true);

      const response = await api.get('/polls');
      setPolls(response.data.polls);
    } catch (error) {
      return toast.show({
        title: 'Não foi possível carregar os bolões.',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus Bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          onPress={() => navigate('find')}
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPollList />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
        />
      )}
    </VStack>
  );
};
