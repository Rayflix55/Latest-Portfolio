import { Link } from 'react-router';

export default function NotFound() {
  return (
      <main id="main" className="mx-auto max-w-[1160px] px-6 py-32">
      <meta name="robots" content="noindex" />
      <p className="kick">404</p>
      <h1 className="h2">Page not found</h1>
      <p className="mt-4 mb-8 text-body">That page doesn&rsquo;t exist.</p>
      <Link className="btn btn-solid" to="/">
        Back home
      </Link>
      </main>
  );
}
