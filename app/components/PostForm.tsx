import type { FormProps} from '@remix-run/react';
import { Form, useTransition } from '@remix-run/react';
import type { FC } from 'react'
import { INTENT } from '~/models/posts/const';
import type { Post } from '~/models/posts/db.server';

type PostFormProps = FormProps & {
  defaultTitle?: string;
  defaultText?: string | null;
  titleError?: string;
  postId?: Post['id'];
}

const BTN = 'block no-underline py-1 px-4 border-1 border-inherit border-solid rounded cursor-pointer'

export const PostForm: FC<PostFormProps> = ({ defaultTitle, defaultText, titleError, postId, ...props }) => {
  const transition = useTransition()
  const loading = {
    [INTENT.create]: transition.submission?.formData.get('intent') === INTENT.create 
    && transition.state !== 'idle',
    [INTENT.delete]: transition.submission?.formData.get('intent') === INTENT.delete 
    && transition.state !== 'idle',
    [INTENT.update]: transition.submission?.formData.get('intent') === INTENT.update
    && transition.state !== 'idle',
  }

  return (
    <>
      <Form {...props}>
        <label >
          <span className="block mb-2">Title:</span>
          {titleError ? <em className='text-red-600'> {titleError}</em> : null}
          <input type='text' name='title' defaultValue={defaultTitle} className="block mb-4 w-full"/>
        </label>
        <label >
          <span className="block mb-2">Text:</span>
          <textarea name='text' defaultValue={defaultText || ''} className="block mb-4 w-full" rows={5} />
        </label>
        { postId ? <input type='hidden' name='postId' value={postId} /> : null }
        { postId ? (
          <button 
            type='submit'
            name='intent'
            value={INTENT.update}
            disabled={loading.update}
            className={`${BTN} text-yellow-600`}
          >
            {loading.update ? 'Updating...' : 'Update'}
          </button>
        ) : (
            <button
              type='submit'
              name='intent'
              value={INTENT.create}
              disabled={loading.create}
              className={`${BTN} text-green-600`}
            >
              {loading.create ? 'Creating...' : 'Create'}
            </button>
        )}
      </Form>
      { postId ? ( 
          <Form method="delete" className='mt-4'>
            <input type='hidden' name='postId' value={postId} />
            <button
              type='submit'
              name='intent'
              value={INTENT.delete}
              disabled={loading.delete}
              className={`${BTN} text-red-600`}
            >
              {loading.delete ? 'Deleting...' : 'Delete'}
            </button>
          </Form>
        ) : null 
      }
    </>
  )
}
