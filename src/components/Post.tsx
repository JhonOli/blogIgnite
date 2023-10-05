import styles from "./Post.module.css";
import ptBR from "date-fns/locale/pt-BR";
import { format, formatDistanceToNow } from "date-fns";
import { Comment } from "./Comment";
import { Avatar } from "./Avatar";
import { FormEvent, useState, ChangeEvent, InvalidEvent } from "react";

interface Author {
  avatarUrl: string;
  name: string;
  role: string;
}
interface Content {
  type: "paragraph" | "link";
  content: string;
}

export interface PostType {
  id: number;
  author: Author;
  content: Content[];
  publishedAt: Date;
}

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const [comments, setComments] = useState(["Post muito banaca, ein!"]);
  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(
    post.publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    { locale: ptBR }
  );

  const publisheDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateNewComment(e: FormEvent) {
    e.preventDefault();
    setComments([...comments, newCommentText]);
    setNewCommentText("");
  }

  function handleNewCommentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity("");
    setNewCommentText(e.target.value);
  }
  function handleNewCommentInvalid(e: InvalidEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity("Este campo não pode ficar vazio!");
  }
  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeletedOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });
    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={post.author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{post.author.name} </strong>
            <span>{post.author.role} </span>
          </div>
        </div>
        <time
          title={publishedDateFormatted}
          dateTime={post.publishedAt.toISOString()}
        >
          {publisheDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {post.content.map((line) => {
          if (line.type === "paragraph") {
            return <p key={line.content}>{line.content} </p>;
          } else if (line.type === "link") {
            return (
              <p key={line.content}>
                <a href="">{line.content} </a>
              </p>
            );
          }
        })}
      </div>
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu comentario</strong>
        <textarea
          required
          onInvalid={handleNewCommentInvalid}
          value={newCommentText}
          onChange={handleNewCommentChange}
          placeholder="Deixe seu comentario"
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>
      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
