function normalizeRecordsPayload(result) {
  return result && result.data != null ? result.data : result;
}

function resolveFieldValue(value) {
  if (value == null) return null;
  const item = Array.isArray(value) ? value[0] : value;
  if (item == null) return null;
  if (typeof item === 'object') {
    return item.id || item.recordId || item.record_id || null;
  }
  return item;
}

function isRecordId(value) {
  return typeof value === 'string' && /^rec[a-zA-Z0-9]+/.test(value);
}

function escapeFormulaString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

module.exports = {
  normalizeRecordsPayload,
  resolveFieldValue,
  isRecordId,
  escapeFormulaString,
};
