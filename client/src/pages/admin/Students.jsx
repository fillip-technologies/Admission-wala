import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  selectStudents,
  selectAdminLoading,
  selectAdminError,
} from "../../features/admin/admin.slice";

export default function Students() {
  const dispatch = useDispatch();

  const students = useSelector(selectStudents);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Students
          </h1>
          <p className="mt-1 text-gray-500">
            Manage all registered students.
          </p>
        </div>

        <button
          onClick={() => dispatch(getAllStudents())}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">
            Total Students
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {students.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">
            Verified
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              students.filter((s) => s.isVerified).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">
            Pending
          </h3>
          <p className="mt-2 text-3xl font-bold text-yellow-500">
            {
              students.filter((s) => !s.isVerified).length
            }
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-5 shadow">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl bg-white p-20 text-center shadow">
          <div className="text-lg font-medium">
            Loading Students...
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={student._id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {student.name}
                    </td>

                    <td className="px-6 py-4">
                      {student.email}
                    </td>

                    <td className="px-6 py-4">
                      {student.phone}
                    </td>

                    <td className="px-6 py-4">
                      {student.isVerified ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}