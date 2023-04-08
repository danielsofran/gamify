
const ViewRegisterRequest = () => {
    const { id } = useParams<{ id: string }>();
    const { data, error, isLoading } = useQuery(
        ["registerRequest", id],
        () => getRegisterRequest(id),
        { retry: false }
    );

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Error />;
    }

    return (
        <div>
        <h1>View Register Request</h1>
        <p>{data?.name}</p>
        <p>{data?.email}</p>
        <p>{data?.phone}</p>
        <p>{data?.address}</p>
        <p>{data?.city}</p>
        <p>{data?.state}</p>
        <p>{data?.zip}</p>
        <p>{data?.country}</p>
        </div>
    );
    };
}