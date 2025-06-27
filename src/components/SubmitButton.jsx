export default function SubmitButton({ loading, text, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full ${
        loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } text-white py-3 rounded-lg transition`}
    >
      {loading ? loadingText : text}
    </button>
  );
}
