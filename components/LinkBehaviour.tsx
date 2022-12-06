import React, { forwardRef } from 'react';
import NextLink from 'next/link';

const LinkBehaviour = forwardRef((props, ref: React.Ref<HTMLAnchorElement>) => (
  <NextLink href="" ref={ref} {...props} />
));

export default LinkBehaviour;
