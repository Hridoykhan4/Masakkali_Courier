const ErrorLoadingState = ({ isPending, isError, error }) => {
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <p className="text-red-600 font-medium text-center">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }

  return null; 
};

export default ErrorLoadingState;
