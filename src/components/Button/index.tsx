import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface Props extends IButtonProps {
  text: string;
  type: "PRIMARY" | "SECONDARY";
}

export const Button = ({ text = "", type = "PRIMARY", ...rest }: Props) => {
  const isSecondary = type === "SECONDARY";

  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="sm"
      textTransform="uppercase"
      bg={isSecondary ? "red.500" : "yellow.500"}
      _pressed={{
        bg: isSecondary ? "red.400" : "yellow.600",
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={isSecondary ? "white" : "black"}
      >
        {text}
      </Text>
    </ButtonNativeBase>
  );
};
