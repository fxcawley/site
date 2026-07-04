import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { IclMechanism, WeightedVote, GdVsCg, KernelShift } from '@/components/figures/metarepicl';

const components = {
  IclMechanism,
  WeightedVote,
  GdVsCg,
  KernelShift,
};

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
      <MDXRemote source={source} components={components} options={{ mdxOptions: mdxOptions as any }} />
    </div>
  );
}
