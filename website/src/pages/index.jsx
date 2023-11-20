import useIsBrowser from '@docusaurus/useIsBrowser';
import { Redirect } from '@docusaurus/router';

export default function Home() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    return <Redirect to={`/react-tiniest-form/docs/category/시작하기`} />;
  }

  return null;
}
