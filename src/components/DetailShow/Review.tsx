import { useQuery } from "@tanstack/react-query";
import { getReview } from "../../utils/fetch";
import { type ShowType } from "../../types/fetch";

const Review = ({
  media_type,
  show_id,
}: {
  media_type: ShowType;
  show_id: number;
}) => {
  const { data } = useQuery({
    queryKey: ["review", media_type, show_id],
    queryFn: () => getReview(media_type, show_id),
  });
  return (
    <section className="">
      <h3>review</h3>
      <ul>
        {data?.results.map((item) => (
          <li key={item.id}>
            {item.author}
            {item.author_details.rating}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Review;
