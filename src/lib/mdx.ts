import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

export async function serializeMdx(source: string) {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: true,
          },
        ],
      ],
    },
  });
}
