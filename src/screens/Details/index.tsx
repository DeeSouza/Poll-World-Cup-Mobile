import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { EmptyMyPollList } from '../../components/EmptyMyPollList';
import { Guesses } from '../../components/Guesses';

import { Header } from '../../components/Header';
import { Loading } from '../../components/Loading';
import { Option } from '../../components/Option';
import { PollCardPros } from '../../components/PollCard';
import { PollHeader } from '../../components/PollHeader';

import { api } from '../../services/api';

interface RouteParams {
  id: string;
}

export function Details() {
  const toast = useToast();
  const route = useRoute();

  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );
  const [poll, setPoll] = useState<PollCardPros>({} as PollCardPros);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = route.params as RouteParams;

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPoll(response.data.poll);
    } catch (error) {
      return toast.show({
        title: 'Não foi possível carregar os detalhes do bolão.',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCoreShare() {
    await Share.share({
      message: poll.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poll.title}
        showBackButton
        showShareButton
        onShare={handleCoreShare}
      />

      {poll._count?.participants > 0 ? (
        <VStack flex={1} bgColor="gray.900">
          <PollHeader data={poll} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses pollId={poll.id} code={poll.code} />
        </VStack>
      ) : (
        <EmptyMyPollList code={poll.code} />
      )}
    </VStack>
  );
}
