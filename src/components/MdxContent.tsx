import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

const mdxOptions = {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [
    rehypeKatex as any,
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: 'github-dark',
        keepBackground: true,
      },
    ],
  ],
};

interface MdxContentProps {
  source: string;
}

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose">
      <MDXRemote source={source} options={{ mdxOptions: mdxOptions as any }} />
    </div>
  );
}
