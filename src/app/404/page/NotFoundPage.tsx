import * as React from 'react';
import { Container } from 'react-bootstrap';

import { Center } from '../../component';
import { PageWrapper } from '../../page';

/** */
export function NotFoundPage() {
  return (
    <PageWrapper>
      <Container>
        <Center className="netsparks-not-found">
          404 Not Found
        </Center>
      </Container>
    </PageWrapper>
  );
}