<?php

namespace App\Services;

use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class QueryFilters
{
    protected $request;
    protected $builder;
    /**
     * Create a new class instance.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function apply(Builder $builder)
    {
        $this->builder = $builder;

        // Aplicar filtros
        $this->applyFilters();

        // Aplicar orden
        $this->applySort();

        // Aplicar paginación
        return $this->applyPagination();
    }

    protected function applyFilters()
    {
        $filters = $this->request->get('filters', []);
        $model = $this->builder->getModel();

        foreach ($filters as $filter) {
            $field = $filter['field'];
            $operator = $filter['operator'] ?? 'equals';
            $value = $filter['value'];

            // Validar si el campo está permitido
            if ($this->isFieldAllowed($model, $field)) {
                $this->builder = $this->applyFilter($field, $operator, $value);
            }
        }
    }

    /**
     * Verifica si un campo es permitido para filtrar.
     */
    protected function isFieldAllowed($model, $field): bool
    {
        $allowedFields = method_exists($model, 'getFilterableFields')
            ? $model::getFilterableFields()
            : [];

        return in_array($field, $allowedFields);
    }

    protected function applyFilter($field, $operator, $value)
    {
        switch ($operator) {
            case '=':
            case 'is':
            case 'equals':
                return $this->builder->where($field, $value);
            case '!=':
            case 'not':
            case 'doesNotEqual':
                return $this->builder->where($field, '!=', $value);
            case 'contains':
                return $this->builder->where($field, 'LIKE', "%$value%");
            case 'doesNotContain':
                return $this->builder->where($field, 'NOT LIKE', "%$value%");
            case 'startsWith':
                return $this->builder->where($field, 'LIKE', "$value%");
            case 'endsWith':
                return $this->builder->where($field, 'LIKE', "%$value");
            case 'isEmpty':
                return $this->builder->where($field, '=', '');
            case 'isNotEmpty':
                return $this->builder->where($field, '!=', '');
            case 'isAnyOf':
                $arr = explode(',', $value);
                if (!is_array($arr)) return $this->builder;
                return $this->builder->whereIn($field, $arr);
            case '>':
            case 'after':
            case 'gt': // Greater than
                return $this->builder->where($field, '>', $value);
            case '>=':
            case 'onOrAfer':
                return $this->builder->where($field, '>=', $value);
            case '<':
            case 'before':
            case 'lt': // Less than
                return $this->builder->where($field, '<', $value);
            case '<=':
            case 'onOrBefore':
                return $this->builder->where($field, '<=', $value);
            default:
                return $this->builder;
        }
    }

    protected function applySort()
    {
        $sort = $this->request->get('sort', []);
        $sortBy = $sort['field'] ?? 'id';
        $sortOrder = $sort['order'] ?? 'asc';
        $model = $this->builder->getModel();

        // Validar si el campo es ordenable
        if ($this->isFieldSortable($model, $sortBy)) {
            $this->builder->orderBy($sortBy, $sortOrder);
        }
    }

    protected function isFieldSortable($model, $field): bool
    {
        $allowedFields = method_exists($model, 'getSortableFields')
            ? $model::getSortableFields()
            : [];

        return in_array($field, $allowedFields);
    }

    protected function applyPagination(): LengthAwarePaginator
    {
        $page = $this->request->get('page', 1);
        $perPage = $this->request->get("perPage", 20);

        return $this->builder->paginate($perPage, ['*'], 'page', $page);
    }
}
