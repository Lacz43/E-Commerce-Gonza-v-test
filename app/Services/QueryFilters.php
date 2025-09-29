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
        // Si es una relación, verificar el prefijo de la relación
        if (strpos($field, '.') !== false) {
            $baseRelation = explode('.', $field)[0];
            $allowedFields = method_exists($model, 'getFilterableFields')
                ? $model::getFilterableFields()
                : [];

            // Verificar tanto snake_case como camelCase del prefijo
            return in_array($baseRelation, $allowedFields) ||
                   in_array($this->snakeToCamel($baseRelation), $allowedFields) ||
                   in_array($this->camelToSnake($baseRelation), $allowedFields);
        }

        $allowedFields = method_exists($model, 'getFilterableFields')
            ? $model::getFilterableFields()
            : [];

        return in_array($field, $allowedFields);
    }

    /**
     * Convierte camelCase a snake_case
     */
    protected function camelToSnake($string): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $string));
    }

    protected function applyFilter($field, $operator, $value)
    {
        // Verificar si el campo contiene una relación (tiene punto)
        if (strpos($field, '.') !== false) {
            return $this->applyRelationFilter($field, $operator, $value);
        }

        // Lógica original para campos normales
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
            case 'gt':
                return $this->builder->where($field, '>', $value);
            case '>=':
            case 'onOrAfer':
                return $this->builder->where($field, '>=', $value);
            case '<':
            case 'before':
            case 'lt':
                return $this->builder->where($field, '<', $value);
            case '<=':
            case 'onOrBefore':
                return $this->builder->where($field, '<=', $value);
            default:
                return $this->builder;
        }
    }

    protected function applyRelationFilter($field, $operator, $value)
    {
        // Separar la relación del campo
        $parts = explode('.', $field);
        $relation = $parts[0];
        $relationField = implode('.', array_slice($parts, 1)); // Para soportar relaciones anidadas
        
        // Convertir snake_case a camelCase para el nombre del método de relación
        $relationMethod = $this->snakeToCamel($relation);
        
        // Verificar si la relación está permitida
        if (!$this->isRelationAllowed($this->builder->getModel(), $relation)) {
            return $this->builder;
        }
        
        // Verificar si la relación existe en el modelo (usando camelCase)
        if (!method_exists($this->builder->getModel(), $relationMethod)) {
            return $this->builder; // Si no existe la relación, retornar sin filtro
        }

        return $this->builder->whereHas($relationMethod, function ($query) use ($relationField, $operator, $value) {
            $this->applyNestedFilter($query, $relationField, $operator, $value);
        });
    }

    /**
     * Convierte snake_case a camelCase
     */
    protected function snakeToCamel($string): string
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $string))));
    }

    /**
     * Verifica si una relación es permitida para filtrar.
     */
    protected function isRelationAllowed($model, $relation): bool
    {
        $allowedRelations = method_exists($model, 'getFilterableRelations')
            ? $model::getFilterableRelations()
            : [];

        // Si no hay restricciones, permitir todas las relaciones
        if (empty($allowedRelations)) {
            return true;
        }

        // Verificar tanto snake_case como camelCase
        return in_array($relation, $allowedRelations) || 
               in_array($this->snakeToCamel($relation), $allowedRelations);
    }

    protected function applyNestedFilter($query, $field, $operator, $value)
    {
        // Si el campo tiene más puntos, seguir anidando relaciones
        if (strpos($field, '.') !== false) {
            $parts = explode('.', $field);
            $relation = $parts[0];
            $nestedField = implode('.', array_slice($parts, 1));
            
            // Convertir snake_case a camelCase para relaciones anidadas
            $relationMethod = $this->snakeToCamel($relation);
            
            $query->whereHas($relationMethod, function ($subQuery) use ($nestedField, $operator, $value) {
                $this->applyNestedFilter($subQuery, $nestedField, $operator, $value);
            });
        } else {
            // Aplicar el filtro al campo de la relación
            switch ($operator) {
                case '=':
                case 'is':
                case 'equals':
                    $query->where($field, $value);
                    break;
                case '!=':
                case 'not':
                case 'doesNotEqual':
                    $query->where($field, '!=', $value);
                    break;
                case 'contains':
                    $query->where($field, 'LIKE', "%$value%");
                    break;
                case 'doesNotContain':
                    $query->where($field, 'NOT LIKE', "%$value%");
                    break;
                case 'startsWith':
                    $query->where($field, 'LIKE', "$value%");
                    break;
                case 'endsWith':
                    $query->where($field, 'LIKE', "%$value");
                    break;
                case 'isEmpty':
                    $query->where($field, '=', '');
                    break;
                case 'isNotEmpty':
                    $query->where($field, '!=', '');
                    break;
                case 'isAnyOf':
                    $arr = explode(',', $value);
                    if (is_array($arr)) {
                        $query->whereIn($field, $arr);
                    }
                    break;
                case '>':
                case 'after':
                case 'gt':
                    $query->where($field, '>', $value);
                    break;
                case '>=':
                case 'onOrAfer':
                    $query->where($field, '>=', $value);
                    break;
                case '<':
                case 'before':
                case 'lt':
                    $query->where($field, '<', $value);
                    break;
                case '<=':
                case 'onOrBefore':
                    $query->where($field, '<=', $value);
                    break;
            }
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
