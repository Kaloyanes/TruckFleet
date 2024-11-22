import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
} from "@react-email/components";

export default function Email() {
  return (
    <Html>
      <Head>
        <title>My email title</title>
      </Head>
      <Tailwind>
        <Container>
          <Body className="w-full h-full">
            <Heading as="h2">Hello world</Heading>
          </Body>
        </Container>
      </Tailwind>
    </Html>
  );
}
