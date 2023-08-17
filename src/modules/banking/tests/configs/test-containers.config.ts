import { GenericContainer, StartedTestContainer } from 'testcontainers';

export const CreateTestContainer = async () => {
  return await new GenericContainer('postgres:14-alpine')
    .withEnvironment({
      POSTGRES_DB: 'testdb',
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
    })
    .withExposedPorts(5432)
    .start();
};

export type TestContainersType = StartedTestContainer;
