interface Props {
  params: {
    id: string;
  };
}

export default function UserDetailsPage({ params }: Props) {
  return <div>User ID: {params.id}</div>;
}
