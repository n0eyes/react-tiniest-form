import useIsBrowser from '@docusaurus/useIsBrowser';

export default function Home() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    location.href = '/docs/category/시작하기';
  }

  return null;
}
