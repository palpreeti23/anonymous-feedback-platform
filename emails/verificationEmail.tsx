import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from "@react-email/components";
// import tailwindConfig from "../tailwind.config";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      {/* <Tailwind config={tailwindConfig}> */}
      <Body className="bg-white font-plaid">
        <Container className="bg-white border border-solid border-[#eee] rounded shadow-[rgba(20,50,70,.2)] shadow-md mt-5 max-w-[360px] mx-auto my-0 pt-[68px] px-0 pb-[130px]">
          <Text className="text-[#0a85ea] text-[11px] font-bold h-4 tracking-[0] leading-[16px] mt-4 mb-2 mx-2 uppercase text-center">
            Verification Code
          </Text>
          <Heading className="text-black font-medium font-[HelveticaNeue-Medium,Helvetica,Arial,sans-serif] inline-block text-[20px] leading-[24px] my-0 text-center">
            welcome {username}, verify your account before login
          </Heading>
          <Section className="bg-[rgba(0,0,0,.05)] rounded mx-auto font-[HelveticaNeue-Bold] mt-4 mb-3.5 align-middle w-[280px]">
            <Text className="text-black text-[32px] font-bold tracking-[6px] leading-10 py-2 mx-auto my-0 block text-center">
              {otp}
            </Text>
          </Section>
          <Text className="text-[#444] text-[15px] leading-[23px] tracking-[0] py-0 px-10 m-0 text-center">
            Not expecting this email?
          </Text>
          <Text className="text-[#444] text-[15px] leading-[23px] tracking-[0] py-0 px-10 m-0 text-center">
            if you did not request this code, please ignore this email.
          </Text>
        </Container>
      </Body>
      {/* </Tailwind> */}
    </Html>
  );
}

export default VerificationEmail;
