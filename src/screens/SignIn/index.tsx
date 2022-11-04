import { Center, Icon, Text } from "native-base";
import { Fontisto } from "@expo/vector-icons";

import Logo from "../../assets/logo.svg";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export function SignIn() {
  const { signIn } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button
        onPress={signIn}
        title="ENTRAR COM O GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        type="SECONDARY"
        isLoading={false}
        mt={12}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  );
}
