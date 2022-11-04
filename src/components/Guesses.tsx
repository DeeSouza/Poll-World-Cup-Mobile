import { useEffect, useState } from 'react';
import { useToast, FlatList } from 'native-base';

import { Game } from './Game';

import { api } from '../services/api';
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${pollId}/games`);
      setGames(response.data.games);
    } catch (error) {
      return toast.show({
        title: 'Não foi possível carregar os palpites.',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite.',
          placement: 'bottom',
          bgColor: 'red.500',
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      return toast.show({
        title: 'Palpite criado com sucesso!',
        placement: 'bottom',
        bgColor: 'green.500',
      });
    } catch (error) {
      return toast.show({
        title: 'Não foi possível enviar o palpite.',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={<EmptyMyPollList code={code} />}
    />
  );
}
